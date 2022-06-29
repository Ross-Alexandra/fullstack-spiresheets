#! /usr/bin/env node

// Type imports
import type * as G from "glob";

// Code imports
import {version} from '../package.json';
import {program} from "commander";
import {glob} from "glob";
import {createCanvas, loadImage} from 'canvas'; 

import _ from 'lodash';
import * as fs from 'fs';

function getFilenameFromPath(path: string) {
    // - split on \\, then pop the last, if no
    //   \\ then it will return the whole string
    // - similarly, split on '/' to do the same
    // - Finally, split on '.' and get the first
    //   token to get just the filename.
    return path.split('\\').pop()?.split('/').pop()?.split('.').shift()?.trim();
}

async function waitForGlob(globArgument: string, options: G.IOptions): Promise<string[]> {
    return new Promise((resolve, reject) => {
        glob(globArgument, options, (err, files) => {
            if (err) reject(err);
            else resolve(files);
        });
    });
}

async function generateSpritesheet(fileGlobs: string[]) {
    const pathNormalizedFileGlobs = fileGlobs.map(fileGlob => fileGlob.replace(/\\/g, "/"));

    const matchingFiles: string[] = [];
    for (const fileGlob of pathNormalizedFileGlobs) {
        console.log(`${fileGlob}`);
        const files = await waitForGlob(fileGlob, {});
        matchingFiles.push(...files);
    }

    // Convert each matching file to an image
    const images = await Promise.all(matchingFiles.map(fileURI => loadImage(fileURI)));

    // Create a blank spritesheet using a naive implementation.
    // Create a width = the sum of the widths, and a height = the
    // tallest image. In the future a better algorithm should be used
    // here to reduce wasted space.
    const canvasHeight = _
        .chain(images)
        .maxBy('height')
        .get('height')
        .value();
    const canvasWidth = _.sumBy(images, 'width');
    console.log(`Generating ${canvasWidth}x${canvasHeight} canvas`);

    const spritesheet = createCanvas(canvasWidth, canvasHeight);
    const spritesheetContext = spritesheet.getContext('2d');

    // For each image, add it to the blank spritesheet.
    // Store it's x, y, L, W, name.
    let spritesheetX = 0;
    const spritesheetData = _
        .chain(images)
        .map(image => {
            const imageY = 0;
            spritesheetContext.drawImage(image, spritesheetX, imageY, image.width, image.height);
            const imagePairs = [getFilenameFromPath(image.src as string), {x: spritesheetX, y: imageY, width: image.width, height: image.height}];

            spritesheetX += image.width;
            return imagePairs;
        })
        .thru(dataPairs => [['version', version], ...dataPairs])
        .fromPairs()
        .value();

    // Generate a spritesheet.png and a spritesheet_data.json.
    const buffer = spritesheet.toBuffer('image/png');
    fs.writeFileSync('spritesheet.png', buffer);
    fs.writeFileSync('spritesheet-data.json', JSON.stringify(spritesheetData, null, 2));

    console.log('Generated spritesheet to spritesheet.png and data to spritesheet-data.json. You can likely vastly reduce the filesize by running it through https://tinypng.com');
}

program
    .name('generate-spritesheet')
    .description('Command line utility to generate a spritesheet of your assets.')
    .version(version)

program
    .argument('<paths...>', 'The path(s) to grab asset(s) from')
    .parse();

generateSpritesheet(program.args);

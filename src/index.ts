import { version } from 'canvas';
import _ from 'lodash';
import { versionParsers } from './parsers';
import { loadImage } from 'canvas';
import { i_V0dot1dot0 } from './parsers/0.1.0';

export type t_spritesheetData = {
    version: string;
} & {
    [key: string]: i_V0dot1dot0; // | i_V0dot1dot1 | ...
}

export async function Spritesheet(spritesheetSource: string, spritesheetData: t_spritesheetData) {
    const spritesheetImage = await loadImage(spritesheetSource);

    const dataVersion = _.get(spritesheetData, 'version', version);
    return _
        .chain(spritesheetData)
        .omit('version')
        .toPairs()
        .map(([imageName, imageData]) => [
            imageName,
            _.get(versionParsers, dataVersion, () => {throw `Unsupported version ${dataVersion}`})(imageData, spritesheetImage)
        ])
        .fromPairs()
        .value()
}

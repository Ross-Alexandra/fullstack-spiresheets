# Fullstack Spritesheet
A combonation tool/library to help people generate, then use "spritesheets" for web applications. 

## Why
This tool is useful for a niche set of circumstances which I ran across while working on a project:
 - I wanted to host on the cloud,
 - I had lots of (somewhat large) images that were required when the user first loaded the page,
 - I wanted to host for free as this is a portolio piece.

When hosting on the cloud, providers will track how much bandwidth is used downloading your
bundle. Because of this, it is often best to optimize your bundle, for me this mean splitting
out my assets from the bundle.

Moving over to cloud storage for my assets, I discovered that providers not only charged by
the byte *but also charged a small fee for each download*. The effect of this was that the
free tier limits on data could not be easily surpassed, but less than 10 loads of my page might
blow past my free-tier download limit.

Thus, since I need to minimize the number of assets stored on the cloud, but need all my assets
at page-load, spritesheets seemed like the perfect solution. 

This tool is most likley useful to you if:
 - You meet the above criteria, or
 - You have enterprise levels of assets which all need to be loaded when the user loads the page. 

For most people, the $.004 charge per 10,000 downloads isn't an issue, but if you want truly
free or to pinch every penny then this package might be for you.

## Usage
### Generating your spritesheet
Before you can do anything, you'll need to generate your spritesheet. To do this, simply run
```
npx generate-spritesheet "path/to/assets/*.jpg" "path/to/other/assets/*.png", ...
```
> At this time, `generate-spritesheets` cannot handle two files having the same name under different directories. This means that if you had `icons/foobar.png` and `banners/foobar.png` and included both in the generation, it would fail. This is because the parser and generated info use the asset names as identifiers. 

This will generate two files `./spritesheet.png` and `./spritesheet-data.json` in your current working directory.

### Using the spritesheet in your webapp
To use the images from your spritesheet in your code, first create a new spritesheet
```javascript
const {data: spritesheetData} = await axios.get('url/to/spritesheet-data.json');
const spritesheetImages = await Spitesheet('url/to/spritesheet.png', spritesheetData);
```

The generates `spriesheetImages` will then be an object with `[assetName]: 'assetDataURL` for each asset, so accessing the
'myBanner' asset could be done like:
```javascript
const myBanner = spritesheet.myBanner;
```
> As mentioned above, the generation tool does not currently support multiple assets with the same name.

# Development Setup
After cloing the repo, first do an `npm i` to install all the dependancies.

Next from root, run
```
npm link
```
This will allow you to run `generate-sprites` as you develop.

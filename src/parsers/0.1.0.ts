import { createCanvas, Image } from "canvas";

export interface i_V0dot1dot0 {
    x: number;
    y: number;
    width: number;
    height: number;
}
export function V0dot1dot0(imageData: i_V0dot1dot0, spritesheetImage: Image) {
    const imageCanvas = createCanvas(imageData.width, imageData.height);
    const imageContext = imageCanvas.getContext('2d');

    imageContext.drawImage(spritesheetImage, imageData.x, imageData.y, imageData.width, imageData.height, 0, 0, imageData.width, imageData.height);

    return imageCanvas.toDataURL('image/png');
}

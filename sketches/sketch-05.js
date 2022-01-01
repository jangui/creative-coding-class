const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

let manager;

let text = 'D';
let fontSize = 800;
let fontFamily = 'Isidora Sans';

const settings = {
  dimensions: [ 1080, 1080 ]
};

const typeCanvas = document.createElement('canvas');
const typeContext = typeCanvas.getContext('2d');

const loadImage = async (url) => {
    return new Promise( async (res, rej) => {
        const img = new Image();
        img.onload = () => res(img);
        img.onerror = () => rej()
        img.src = url;
        img.crossOrigin = "anonymous";
    });
}

const sketch = async ({context, width, height}) => {
  dimension = 20;
  cols = Math.floor(width / dimension);
  rows = Math.floor(height / dimension);
  cells = cols * rows;

  //typeCanvas.width = cols;
  //typeCanvas.height = rows;

  //let url = 'https://s1.favim.com/orig/10/black-and-white-face-girl-photography-portrait-Favim.com-174184.jpg';
  let url = 'https://mocah.org/thumbs/1021396-face-white-black-women-monochrome-model-portrait-photography-black-hair-freckles-hair-nose-skin-Walter-Belfiore-head-girl-beauty-eye-darkness-black-and-white-monochrome.jpg';
  url = 'https://images.squarespace-cdn.com/content/v1/5a3819a52278e769113d9372/1536251808454-4IOP9M7HIH4GKY9B9F6K/black-and-white-black-and-white-face-1164829.jpg?format=1000w';
  const img = await loadImage(url);
  typeCanvas.width = img.width;
  typeCanvas.height = img.height;

  return ({context, width, height}) => {
    // reset  context
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    // reset type context
    typeContext.fillStyle = 'black';
    typeContext.fillRect(0, 0, img.width, img.height);

    // draw text onto typeContext
    //drawText(text, typeContext, 'white', cols, false);

    typeContext.drawImage(img, 0, 0);

    // draw typeContext
    //context.drawImage(typeCanvas, 0, 0);

    // get image data from typeCanvas
    const typeData = typeContext.getImageData(0,0,img.width,img.height).data;
    console.log(typeData);

    for (let i = 0; i < img.width*img.height ; ++i) {
        let col = i % img.width;
        let row = Math.floor(i / img.width);


       // let x = col * dimension;
        //let y = row * dimension;
        let x = col * (width / img.width);
        let y = row * (height / img.height);

        // get rgb values from type canvas
        r = typeData[i * 4 + 0];
        g = typeData[i * 4 + 1];
        b = typeData[i * 4 + 2];
        a = typeData[i * 4 + 3];

        // setup context for drawing
        context.save();
        context.translate(x, y);

        //context.fillStyle = `rgb(${r}, ${g}, ${b})`;

        /*
        let glyph = getGlyph(r, g, b);
        fontSize = 5;
        if (Math.random() < 0.1) {fontSize = fontSize*2;}
        context.font = `${fontSize}px ${fontFamily}`;
        context.fillText(glyph, 0, 0);
        */
        context.globalAlpha = Math.random();
        const brightness = (r + g + b) / 3;
        if (brightness < 50) {
            context.fillStyle = 'yellow';
            context.fillRect(0, 0,1,1);

        } else if (brightness < 100) {
            context.fillStyle = 'green';
            context.fillRect(0, 0,1,1);

        } else if (brightness < 150) {
            context.fillStyle = 'blue';
            context.beginPath();
            context.arc(0,0,1,0, Math.PI*2);
            context.fill();
        } else {
            context.fillStyle = 'red';
            context.beginPath();
            context.arc(0,0,2,0, Math.PI*2);
            context.fill();
        }

        // retore context
        context.restore();
    }
  };
};

const drawText = (text, context, color, size, boundingBox) => {
    // save context
    context.save();

    // font settings
    context.fillStyle = color;
    fontSize = size;
    context.font = `${fontSize}px ${fontFamily}`;
    context.textBaseline = 'top';

    // get size of text
    const metrics = context.measureText(text);
    const leftBound = metrics.actualBoundingBoxLeft * -1;
    const topBound = metrics.actualBoundingBoxAscent * -1;
    const textWidth = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
    const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    const x = (cols - textWidth) * 0.5 - leftBound;
    const y = (rows - textHeight) * 0.5 - topBound;

    // translate context
    context.translate(x, y);

    // draw bounding box
    if (boundingBox) {
        context.beginPath();
        context.rect(leftBound, topBound, textWidth, textHeight);
        context.stroke();
    }

    // draw text
    context.fillText(text, 0, 0);

    // restore context
    context.restore();
}

const getGlyph = (r, g, b) => {
    const brightness = (r + g + b) / 3;
    if (brightness < 50) return '';
    if (brightness < 100) return '-';
    if (brightness < 150) return '+';

    glyphs = `* & ^ % ${text.toUpperCase()} ${text}`.split(' ');

    return random.pick(glyphs);
}

const keyupHandler = (evnt) => {
    text = evnt.key.toUpperCase();
    manager.render();
}

const main = async () => {
    //document.addEventListener('keyup', keyupHandler);
    manager = await canvasSketch(sketch, settings);
}

main();

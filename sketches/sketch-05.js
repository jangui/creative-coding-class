const canvasSketch = require('canvas-sketch');

let manager;

let text = 'D';
let fontSize = 1200;
let fontFamily = 'Isidora Sans';

const settings = {
  dimensions: [ 1080, 1080 ]
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    context.fillStyle = 'black';
    context.font = `${fontSize}px ${fontFamily}`;
    context.textBaseline = 'top';

    const metrics = context.measureText(text);

    const leftBound = metrics.actualBoundingBoxLeft * -1;
    const topBound = metrics.actualBoundingBoxAscent * -1;
    const textWidth = leftBound + metrics.actualBoundingBoxRight;
    const textHeight = topBound + metrics.actualBoundingBoxDescent;

    // const x = (middle of canvas) - (half width of text);
    const x = (width * 0.5) - (textWidth * 0.5);
    const y = (height * 0.5) - (textHeight * 0.5);

    context.beginPath();
    context.rect(x, y, textWidth, textHeight);
    context.stroke();

    context.save();
    context.translate(x, y);
    context.fillText(text, 0, 0);
    context.restore();
  };
};

const keyupHandler = (evnt) => {
    text = evnt.key.toUpperCase();
    manager.render();
}

const start = async () => {
    manager = await canvasSketch(sketch, settings);
}

document.addEventListener('keyup', keyupHandler);
start();

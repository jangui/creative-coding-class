const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 1080, 1080 ]
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    context.fillStyle = 'black';

    const cx = width * 0.5;
    const cy = width * 0.5;
    const w = width * 0.01;
    const h = height * 0.1;

    const numRects = 20;

    const radius = width * 0.3;
    let x, y;

    for (let i = 0; i < numRects; i++) {
        const offset = math.degToRad(360 / numRects);
        let angle = offset * i;

        x = cx + Math.sin(angle) * radius;
        y = cy + Math.cos(angle) * radius;

        // draw rectangles
        context.save();
        context.translate(x, y);
        context.rotate(-angle);
        context.scale(random.range(0.1, 2), random.range(0.2, 0.5));

        context.beginPath();
        context.rect(-w * 0.5, random.range(0, -h * 0.5), w, h);
        context.fill();
        context.restore();

        // draw arcs
        context.save();
        context.translate(cx, cy);
        context.rotate(-angle);

        context.lineWidth = random.range(5, 20);

        context.beginPath();
        let arcAng = offset * random.range(1, 5);
        context.arc(0,0, radius * random.range(0.7, 1.3), -arcAng, arcAng);
        context.stroke();
        context.restore();
    }
  };
};

canvasSketch(sketch, settings);

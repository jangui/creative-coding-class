const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');
const TweakPane = require('tweakpane');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
};

const params = {
    cols: 10,
    rows: 10,
    amplitude: 0.2,
    frameMultiplier: 5,
    frequency: 0.001,
    maxWidth: 5,
    minWidth: 1,
};

const sketch = () => {
  return ({ context, width, height, frame }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    const x = width * 0.1;
    const y = height * 0.1;

    const grd = new Grid(x, y, params.cols, params.rows);
    grd.draw(context, width*0.8, height*0.8, frame*params.frameMultiplier);
  };
};

class Grid {
    constructor(x, y, cols, rows) {
        this.x = x;
        this.y = y;
        this.cols = cols;
        this.rows = rows;

    }

    draw(context, width, height, frame) {
        context.strokeStyle = 'black';
        const cellw = width / this.cols;
        const cellh = height / this.rows;

        for (let i = 0; i < this.rows*this.cols; i++) {
            const col = i % this.cols;
            const row = Math.floor(i / this.cols);
            const x = this.x + cellw * col;
            const y = this.y + cellh * row;

            const w = cellw * 0.8;
            const h = cellh + 0.8;


            context.save();

            let n = random.noise3D(x, y, frame, params.frequency);
            let angle = n * Math.PI * params.amplitude;
            context.lineWidth = math.mapRange(n, -1, 1, params.minWidth, params.maxWidth);
            //context.lineWidth = n * params.maxWidth;

            context.translate(x, y);
            context.translate(cellw * 0.5, cellh * 0.5);
            context.rotate(angle);

            context.beginPath();
            context.moveTo(cellw*0.5+1, 0);
            context.lineTo(cellw*-0.5, 0);
            context.stroke();

            context.restore()
        }
    }
}

const createPane = () => {
    const pane = new TweakPane.Pane();
    let folder;

    folder = pane.addFolder({title: 'Grid'});
    folder.addInput(params, "cols", {min: 2, max: 50, step: 1});
    folder.addInput(params, "rows", {min: 2, max: 50, step: 1});
    folder.addInput(params, "maxWidth", {min: 0, max: 30});
    folder.addInput(params, "minWidth", {min: 0, max: 10});

    folder = pane.addFolder({title: 'Noise'});
    folder.addInput(params, "frameMultiplier", {min: 1, max: 20});
    folder.addInput(params, "amplitude", {min: 0, max: 5, step: 0.1});
    folder.addInput(params, "frequency", {min: 0, max: 0.01, step: 0.0001});

}

createPane();
canvasSketch(sketch, settings);

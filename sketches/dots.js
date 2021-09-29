const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');
const Tweakpane = require('tweakpane');

const params = {
    dots: 800,
    minRadius: 1,
    maxRadius: 5,
    frameMult: 5,
    frequency: 0.001,
    radius: 300,
    angle: Math.PI * 2,
};

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
};

const sketch = ({context, width, height}) => {
  let points = []
  let radius = 10
  let angle = 0;
  for (let i = 0; i < params.dots; i++) {
    radius = random.range(0, params.radius);
    angle = random.range(0, params.angle);
    //radius += 0.2;
    //angle += 0.05;
    //angle = angle >= Math.PI * 2 ? 0 : angle;
    //let x = random.range(0, width);
    //let y = random.range(0, height);
    //let angle = random.range(0, Math.PI*2);
    let x = Math.cos(angle) * radius + (width/2);
    let y  = Math.sin(angle) * radius + (height/2);
    points.push(new Point(x, y));

    if (i != 0) points[i].friend = points[i-1];

  }

  return ({ context, width, height, frame }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    points.forEach( point => {
       point.draw(context);
       point.update(frame*params.frameMult, width, height);
    });
  };
};

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = random.range(params.minRadius, params.maxRadius);
        this.friend;
    }

    draw(context) {
        context.fillStyle = 'black';

        context.save();
        context.translate(this.x, this.y);

        context.beginPath();
        context.arc(0, 0, this.radius, 0, Math.PI * 2);
        context.fill();
        //context.stroke();

        context.restore();


        //context.lineWidth = math.mapRange(dist, 0, 200, 12, 1);
        //context.strokeStyle = I/g
        if (this.friend) {
            context.beginPath();
            context.moveTo(this.x, this.y);
            context.lineTo(this.friend.x, this.friend.y);
            context.stroke();
        }
    }

    update(frame, width, height) {
        let n = random.noise3D(this.x, this.y, frame, params.frequency);
        //this.radius = math.mapRange(n, -1, 1, params.minRadius, params.maxRadius);
        this.radius = n * params.maxRadius > 0 ? n*params.maxRadius : 0;

        if (n * params.maxRadius > 0) {
            this.radius = n * params.maxRadius;
        } else {
            this.radius = 0;
            //let radius = math.mapRange(n, -1, 1, 0, params.radius);
            //let angle = math.mapRange(n, -1, 1, 0, params.angle);
            let radius = random.range(0, params.radius);
            let angle = random.range(0, params.angle);
            this.x = Math.cos(angle) * radius + (width/2);
            this.y  = Math.sin(angle) * radius + (height/2);
        }

    }

}

const createPane = () => {
    const pane = new Tweakpane.Pane();
    let folder;

    folder = pane.addFolder({ title: "dots"});
    folder.addInput(params, "dots", {min: 0, max: 2000});
    folder.addInput(params, "frameMult", {min: 1, max: 50});
    folder.addInput(params, "minRadius", {min: 0, max: 20});
    folder.addInput(params, "maxRadius", {min: 0, max: 20});

    folder = pane.addFolder({ title: "Noise"});
    folder.addInput(params, "frequency", {min: 0.001, max: 0.01, step: 0.001});

    folder = pane.addFolder({ title: "circle"});
    folder.addInput(params, "radius", {min: 0.1, max: 1000});
    folder.addInput(params, "angle", {min: 0, max: Math.PI*2});
};

createPane();
canvasSketch(sketch, settings);

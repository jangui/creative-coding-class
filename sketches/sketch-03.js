const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true
};

const sketch = ({context, width, height}) => {
  agents = [];
  totalAgents = 40;

  for (let i = 0; i < totalAgents; i++) {
      const x = random.range(0, width);
      const y = random.range(0, height);
      agents.push(new Agent(x, y));
  }

  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    for (let i = 0; i < agents.length; i++) {
        agent = agents[i];

        for (let j = i+1; j < agents.length; j++) {
            otherAgent = agents[j];

            dist = agent.pos.dist(otherAgent.pos);

            if (dist > 200) continue;

            context.lineWidth = math.mapRange(dist, 0, 200, 12, 1);
            context.strokeStyle = 'white';

            context.beginPath();
            context.moveTo(agent.pos.x, agent.pos.y);
            context.lineTo(otherAgent.pos.x, otherAgent.pos.y);
            context.stroke();
        }
    }

    agents.forEach(agent => {
        agent.update(width, height);
        agent.draw(context);
    })
  };
};

canvasSketch(sketch, settings);

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    dist(v) {
        let dx = this.x - v.x;
        let dy = this.y - v.y;
        return Math.sqrt(dx**2 + dy**2);
    }
}

class Agent {
    constructor(x, y) {
        this.pos = new Vector(x, y);
        this.velocity = new Vector(random.range(-1, 1), random.range(-1, 1));
        this.radius = random.range(4,12);
    }

    draw(context) {
        context.fillStyle = 'black';
        context.strokeStlye = 'white';

        context.save();
        context.translate(this.pos.x, this.pos.y);

        context.lineWidth = 4;

        context.beginPath();
        context.arc(0, 0, this.radius, 0, Math.PI * 2);
        context.fill();
        context.stroke();

        context.restore();
    }

    update(width, height) {
        this.pos.x += this.velocity.x;
        this.pos.y += this.velocity.y;
        this.bounce(width, height);
    }

    bounce(width, height) {
        if (this.pos.x >= width-this.radius || this.pos.x <= this.radius) {
            this.velocity.x *= -1;
        }
        if (this.pos.y >= width-this.radius || this.pos.y <= this.radius) {
            this.velocity.y *= -1;
        }
    }
}

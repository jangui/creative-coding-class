const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true
};

//const gradient = ['#5c2af1', '#0052ff', '#006aff', '#007aff', '#0086ff', '#008fff', '#0096e9', '#009ccc', '#00a1ac', '#00a58c', '#00a96d', '#00ac51', '#11ad38']

const gradient = ['#c7e84e', '#d0e142', '#d8da36', '#e0d32b', '#e7cb21', '#efc319', '#f6bb13', '#fcb211', '#ffaa13', '#ffa018', '#ff971f', '#ff8d27', '#ff832f', '#ff7837', '#ff6d3f', '#ff6148', '#ff5550', '#ff4759', '#ff3963', '#ff286c', '#ff1276', '#ff0080', '#ff008a', '#ff0094', '#ff009f', '#f800a9', '#ee00b4', '#e100be', '#d300c8', '#c317d1']

const sketch = ({context, width, height}) => {
  agents = [];
  totalAgents = 40;

  // create agents and store in array
  for (let i = 0; i < totalAgents; i++) {
      const x = random.range(0, width);
      const y = random.range(0, height);
      agents.push(new Agent(x, y));
      agents[i].grd = gradient;
      agents[i].connections = [];
      agents[i].color = gradient[gradient.length-1];
  }

  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    // check distance to other agents
    for (let i = 0; i < agents.length; i++) {
        agent = agents[i];
        for (let j = i+1; j < agents.length; j++) {
            otherAgent = agents[j];
            dist = agent.pos.dist(otherAgent.pos);
            if (dist > 200) continue;
            // if other agent close enough, store that agent & dist
            agent.connections.push([dist, otherAgent]);
        }
    }

    // update and draw each agent
    agents.forEach(agent => {
        agent.update(width, height);
        agent.draw(context);
        agent.connections = [];
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
        this.connections = 0;
    }

    draw(context) {
        this.updateColor();
        this.drawNode(context);
        this.drawConnections(context);
    }

    drawConnections(context) {
        for (let i = 0; i < this.connections.length; i++) {
                dist = this.connections[i][0];
                otherAgent = this.connections[i][1];

                const grd = context.createLinearGradient(this.pos.x, this.pos.y, otherAgent.pos.x, otherAgent.pos.y);
                grd.addColorStop(0, this.color);
                grd.addColorStop(1, otherAgent.color);

                context.lineWidth = math.mapRange(dist, 0, 200, 12, 1);
                context.strokeStyle = grd;

                context.beginPath();
                context.moveTo(this.pos.x, this.pos.y);
                context.lineTo(otherAgent.pos.x, otherAgent.pos.y);
                context.stroke();
        }
    }

    drawNode(context) {
        context.fillStyle = this.color;
        context.strokeStyle = 'white';

        context.save();
        context.translate(this.pos.x, this.pos.y);

        context.lineWidth = 4;

        context.beginPath();
        context.arc(0, 0, this.radius, 0, Math.PI * 2);
        context.fill();
        //context.stroke();

        context.restore();
    }

    update(width, height) {
        this.pos.x += this.velocity.x;
        this.pos.y += this.velocity.y;
        this.bounce(width, height);
    }

    updateColor() {
        // max connections will effect the agents color
        // if the agent has more connections than max
        // then they will still be connected but the color wont change past max
        let maxConnections = 12;
        if (maxConnections > gradient.length-1) maxConnections = gradient.length-1;
        let connections = this.connections.length;
        if (connections > maxConnections) connections = maxConnections;
        let index = math.mapRange(connections, 0, maxConnections, gradient.length-1, 0);
        this.color = gradient[Math.round(index)];
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

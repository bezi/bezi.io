var canvas = document.getElementById('starfield');
var context = canvas.getContext('2d');

class Star {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.rChange = 0.015;
    this.color = Star.randomColor();
  }

  static randomColor() {
    const colors = ['#ffffff', '#ffecd3', '#bfcfff'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  render() {
    context.beginPath();
    context.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
    context.shadowBlur = 8;
    context.shadowColor = 'white';
    context.fillStyle = this.color;
    context.fill();
  }

  update() {
    if (this.r > 2 || this.r < 0.8) {
      this.rChange = -this.rChange;
    }

    this.r += this.rChange;
  }
}

var C_WIDTH = (canvas.width = document.body.offsetWidth);
var C_HEIGHT = (canvas.height = document.body.offsetHeight);

var arrStars = [];
for (let i = 0; i < 400; i++) {
  var randX = Math.floor(Math.random() * C_WIDTH + 1);
  var randY = Math.floor(Math.random() * (C_HEIGHT / 2) + 1);
  var randR = Math.random() * 1.7 + 0.5;

  var star = new Star(randX, randY, randR);
  arrStars.push(star);
}

function animate() {
  for (let i = arrStars.length - 1; i >= 0; --i) {
    arrStars[i].update();
  }

  context.clearRect(0, 0, C_WIDTH, C_HEIGHT);
  for (var i = 0; i < arrStars.length; i++) {
    arrStars[i].render();
  }
  requestAnimationFrame(animate);
}

animate();

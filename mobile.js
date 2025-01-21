let highestZ = 1;

class Paper {
  holdingPaper = false;
  startX = 0;
  startY = 0;
  moveX = 0;
  moveY = 0;
  prevX = 0;
  prevY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentX = 0;
  currentY = 0;
  rotating = false;

  init(paper) {
    const isTouchDevice = 'ontouchstart' in window;

    const startEvent = isTouchDevice ? 'touchstart' : 'mousedown';
    const moveEvent = isTouchDevice ? 'touchmove' : 'mousemove';
    const endEvent = isTouchDevice ? 'touchend' : 'mouseup';

    const getCoordinates = (e) => {
      if (isTouchDevice) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
      return { x: e.clientX, y: e.clientY };
    };

    const handleStart = (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      const coords = getCoordinates(e);
      this.startX = coords.x;
      this.startY = coords.y;
      this.prevX = coords.x;
      this.prevY = coords.y;

      paper.style.zIndex = highestZ++;
    };

    const handleMove = (e) => {
      if (!this.holdingPaper) return;

      const coords = getCoordinates(e);
      this.moveX = coords.x;
      this.moveY = coords.y;

      this.velX = this.moveX - this.prevX;
      this.velY = this.moveY - this.prevY;

      if (!this.rotating) {
        this.currentX += this.velX;
        this.currentY += this.velY;
      }

      const dirX = this.moveX - this.startX;
      const dirY = this.moveY - this.startY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      const angle = Math.atan2(dirY / dirLength, dirX / dirLength);
      this.rotation = this.rotating ? (180 * angle) / Math.PI : this.rotation;

      paper.style.transform = `translateX(${this.currentX}px) translateY(${this.currentY}px) rotateZ(${this.rotation}deg)`;

      this.prevX = this.moveX;
      this.prevY = this.moveY;
    };

    const handleEnd = () => {
      this.holdingPaper = false;
      this.rotating = false;
    };

    paper.addEventListener(startEvent, handleStart);
    document.addEventListener(moveEvent, handleMove);
    document.addEventListener(endEvent, handleEnd);
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});

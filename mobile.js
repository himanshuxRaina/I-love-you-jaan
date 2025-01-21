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
  animationFrame = null;

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

      const coords = getCoordinates(e);
      this.holdingPaper = true;
      this.startX = coords.x;
      this.startY = coords.y;
      this.prevX = coords.x;
      this.prevY = coords.y;

      paper.style.zIndex = highestZ++;
      paper.style.willChange = 'transform'; // Enable GPU acceleration
    };

    const handleMove = (e) => {
      if (!this.holdingPaper) return;

      e.preventDefault(); // Prevent page scrolling on mobile devices

      const coords = getCoordinates(e);
      this.moveX = coords.x;
      this.moveY = coords.y;

      // Smooth velocity calculation
      this.velX = (this.moveX - this.prevX) * 0.2 + this.velX * 0.8;
      this.velY = (this.moveY - this.prevY) * 0.2 + this.velY * 0.8;

      this.prevX = this.moveX;
      this.prevY = this.moveY;

      // Trigger rendering loop
      if (!this.animationFrame) {
        this.animationFrame = requestAnimationFrame(() => this.updatePosition(paper));
      }
    };

    const handleEnd = () => {
      this.holdingPaper = false;

      // Stop rendering loop
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
        this.animationFrame = null;
      }

      paper.style.willChange = 'auto'; // Reset GPU resources
    };

    paper.addEventListener(startEvent, handleStart);
    document.addEventListener(moveEvent, handleMove, { passive: false });
    document.addEventListener(endEvent, handleEnd);
  }

  updatePosition(paper) {
    const scale = window.devicePixelRatio || 1; // Adjust for high-DPR screens
    this.currentX += this.velX * scale;
    this.currentY += this.velY * scale;

    paper.style.transform = `translate3d(${this.currentX}px, ${this.currentY}px, 0) rotateZ(${this.rotation}deg)`;

    // Continue rendering while holding the paper
    if (this.holdingPaper) {
      this.animationFrame = requestAnimationFrame(() => this.updatePosition(paper));
    } else {
      this.animationFrame = null;
    }
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});

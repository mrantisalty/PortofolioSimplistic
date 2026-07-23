// ==========================================
// 1. IRIS LOADING SCREEN CONTROLLER
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
  const loadingScreen = document.getElementById('loadingScreen');

  if (loadingScreen) {
    setTimeout(() => {
      loadingScreen.classList.add('iris-out');
    }, 1200);
  }
});

// ==========================================
// 2. DROPDOWN MENU CONTROLLER
// ==========================================
const dropdownToggle = document.getElementById('dropdownToggle');
const dropdownMenu = document.getElementById('dropdownMenu');
const dropdownWrapper = document.getElementById('dropdownWrapper');
const arrowIcon = document.getElementById('arrowIcon');

if (dropdownToggle && dropdownMenu) {
  dropdownToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isHidden = dropdownMenu.classList.toggle('hidden');
    if (arrowIcon) {
      arrowIcon.classList.toggle('rotate', !isHidden);
    }
  });
}

document.addEventListener('click', (e) => {
  if (dropdownWrapper && !dropdownWrapper.contains(e.target)) {
    dropdownMenu.classList.add('hidden');
    if (arrowIcon) {
      arrowIcon.classList.remove('rotate');
    }
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && dropdownMenu) {
    dropdownMenu.classList.add('hidden');
    if (arrowIcon) {
      arrowIcon.classList.remove('rotate');
    }
  }
});

// ==========================================
// 3. SMOOTH NAVIGATION LINK SCROLLING
// ==========================================
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    
    const targetId = link.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ==========================================
// 4. CURSOR ARROW AFTER-IMAGE GHOST ENGINE
// ==========================================
(() => {
  const canvas = document.createElement('canvas');
  canvas.id = 'cursorArrowGhostCanvas';
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9998';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const ghosts = [];
  let lastX = 0;
  let lastY = 0;

  class CursorArrowGhost {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.scale = 0.65;      // Compact size
      this.opacity = 0.85;    // Initial glow intensity
      this.decay = 0.045;     // Fade speed
    }

    update() {
      this.scale += 0.005;
      this.opacity -= this.decay;
    }

    draw() {
      if (this.opacity <= 0) return;

      // Get active page theme accent color
      const activeAccent = getComputedStyle(document.body).getPropertyValue('--theme-accent').trim() || '#ff1e43';

      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.scale(this.scale, this.scale);

      // --- Draw Arrow Pointer Path ---
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, 22);
      ctx.lineTo(5.5, 16.5);
      ctx.lineTo(10.5, 25);
      ctx.lineTo(14, 23);
      ctx.lineTo(9, 14.5);
      ctx.lineTo(16.5, 14.5);
      ctx.closePath();

      // --- Outer Glowing Halo ---
      ctx.fillStyle = activeAccent;
      ctx.globalAlpha = Math.max(0, this.opacity * 0.75);
      ctx.shadowColor = activeAccent;
      ctx.shadowBlur = 12;
      ctx.fill();

      // --- Inner Outline Core ---
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.globalAlpha = Math.max(0, this.opacity);
      ctx.stroke();

      ctx.restore();
    }
  }

  window.addEventListener('mousemove', (e) => {
    const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);

    if (dist > 8) {
      ghosts.push(new CursorArrowGhost(e.clientX, e.clientY));
      lastX = e.clientX;
      lastY = e.clientY;
    }
  });

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = ghosts.length - 1; i >= 0; i--) {
      ghosts[i].update();
      ghosts[i].draw();

      if (ghosts[i].opacity <= 0) {
        ghosts.splice(i, 1);
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
})();

// ==========================================
// 5. LIGHTBOX MODAL CONTROLLER
// ==========================================
function openLightbox(imageSrc) {
    const modal = document.getElementById('lightboxModal');
    const modalImg = document.getElementById('lightboxImage');
    modal.classList.remove('hidden');
    modalImg.src = imageSrc;
  }

  function closeLightbox() {
    const modal = document.getElementById('lightboxModal');
    modal.classList.add('hidden');
  }

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeLightbox();
  }
});
let currentSpeed = 2;

function getVideos() {
  return document.querySelectorAll('video');
}

function applySpeed(speed) {
  currentSpeed = Math.max(0.25, Math.min(speed, 16));

  getVideos().forEach(video => {
    video.playbackRate = currentSpeed;
  });

  const speedLabel = document.getElementById('turbo-speed-label');
  if (speedLabel) {
    speedLabel.textContent = `${currentSpeed.toFixed(2)}x`;
  }

  chrome.storage.sync.set({ turboVideoSpeed: currentSpeed });
}

function createController() {
  if (document.getElementById('turbo-video-controller')) return;

  const controller = document.createElement('div');
  controller.id = 'turbo-video-controller';

  controller.innerHTML = `
    <button id="turbo-decrease">-</button>
    <span id="turbo-speed-label">${currentSpeed}x</span>
    <button id="turbo-increase">+</button>
  `;

  document.body.appendChild(controller);

  document.getElementById('turbo-increase').addEventListener('click', () => {
    applySpeed(currentSpeed + 0.25);
  });

  document.getElementById('turbo-decrease').addEventListener('click', () => {
    applySpeed(currentSpeed - 0.25);
  });
}

chrome.storage.sync.get(['turboVideoSpeed'], (result) => {
  if (result.turboVideoSpeed) {
    currentSpeed = result.turboVideoSpeed;
  }

  applySpeed(currentSpeed);
  createController();
});

setInterval(() => {
  applySpeed(currentSpeed);
}, 1500);

window.addEventListener('keydown', (event) => {
  if (event.key === 'd') {
    applySpeed(currentSpeed + 0.25);
  }

  if (event.key === 's') {
    applySpeed(currentSpeed - 0.25);
  }

  if (event.key === 'r') {
    applySpeed(1);
  }
});

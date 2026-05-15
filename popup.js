const speedRange = document.getElementById('speedRange');
const speedValue = document.getElementById('speedValue');

chrome.storage.sync.get(['turboVideoSpeed'], (result) => {
  const speed = result.turboVideoSpeed || 2;
  speedRange.value = speed;
  speedValue.textContent = `${speed}x`;
});

speedRange.addEventListener('input', async () => {
  const speed = parseFloat(speedRange.value);

  speedValue.textContent = `${speed}x`;

  chrome.storage.sync.set({ turboVideoSpeed: speed });

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: (playbackSpeed) => {
      document.querySelectorAll('video').forEach(video => {
        video.playbackRate = playbackSpeed;
      });
    },
    args: [speed]
  });
});

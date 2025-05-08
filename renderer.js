// renderer.js

// Basic DOM refs
const infoEl      = document.getElementById('info');
const progressEl  = document.getElementById('progress');
const downloadBtn = document.getElementById('downloadBtn');
const installBtn  = document.getElementById('installBtn');
const countDisplay= document.getElementById('count');
const incrementBtn= document.getElementById('incrementBtn');

// Show versions
infoEl.innerText = `Chrome v${versions.chrome()}, Node v${versions.node()}, Electron v${versions.electron()}`;

// Ping test
(async () => {
  console.log(await versions.ping());   // or window.updater.ping() if you moved it
})();

// Auto-update event listeners (run immediately)
window.updater.onChecking(() => {
  infoEl.innerText = 'Checking for updates…';
});
window.updater.onAvailable(info => {
  infoEl.innerText = `Update available: v${info.version}`;
  downloadBtn.disabled = false;
});
window.updater.onNotAvailable(() => {
  infoEl.innerText = "You're up to date!";
});
window.updater.onProgress(progress => {
  progressEl.innerText = `Downloading: ${Math.round(progress.percent)}%`;
});
window.updater.onDownloaded(() => {
  infoEl.innerText = 'Downloaded! Ready to install.';
  installBtn.disabled = false;
});

// Download / Install buttons
downloadBtn.addEventListener('click', () => {
  downloadBtn.disabled = true;
  window.updater.download();
});
installBtn.addEventListener('click', () => {
  window.updater.install();
});

// Your counter logic stays the same
let count = 0;
incrementBtn.addEventListener('click', () => {
  count += 2;
  countDisplay.innerText = count;
});

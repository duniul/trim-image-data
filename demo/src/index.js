import trimImageData from 'trim-image-data';
import './styles.css';
import { loadCanvasFromFile } from './utils/canvas';

const canvas = document.getElementById('canvas');
const fileInput = document.getElementById('file-input');
const trimButton = document.getElementById('trim-button');
let loadedImageData;

function enableElements() {
  document.querySelectorAll('input,button').forEach(element => (element.disabled = false));
}

fileInput.addEventListener('change', async event => {
  const file = event.target.files?.[0];

  if (file) {
    loadedImageData = await loadCanvasFromFile(canvas, file);
    enableElements();
  }
});

trimButton.addEventListener('click', async () => {
  if (loadedImageData) {
    const trimmedImageData = trimImageData(loadedImageData);

    canvas.width = trimmedImageData.width;
    canvas.height = trimmedImageData.height;
    canvas.getContext('2d').putImageData(trimmedImageData, 0, 0);
  }
});

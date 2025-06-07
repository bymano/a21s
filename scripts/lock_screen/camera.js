import { constants } from '../utils/dom_constants.js';
import { setDisplay } from '../utils/dom_selectors.js';

const { unlockBtn, cameraFlashlight } = constants;

// To ensure no double streaming
let streamState = false;

// For efficient handling

let flashlightState = false;

let timeoutId;

// Ensure correct aspect ratio used for camera

const constraints = {
  video: {
    width: 422.4,
    height: 918,
    facingMode: 'user'
  }
}

export function activateCamera(el) {

  // Don't run if stream already available
  if (streamState) return;

  // If user allows camera access, display the video on the screen, if not, log an error.
  streamState = true;
  navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    el.srcObject = stream;
    setDisplay(el, 'initial');
    unlockBtn.style.outline = '1px solid rgba(255, 0, 0, .75)';
    el.style.zIndex = 5;
    setDisplay(cameraFlashlight, 'initial');
  }).catch((error) => {
    console.error(error)
  })
}

export function deactivateCamera(el) {
  const stream = el.srcObject;
  if (!stream) return;
  if (!streamState) return;

  // Stop stream
  streamState = false;
  stream.getTracks().forEach(track => track.stop());

  // Remove video from display

  el.srcObject = null;
  unlockBtn.style.outline = '';
  setDisplay(cameraFlashlight, 'none');
  deactivateFlashlight();
  flashlightState = false;
}

function flashlightAnimation() {
  cameraFlashlight.style.transform = 'rotate(360deg)';
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    cameraFlashlight.style.transform = '';
  }, 200)
}

export function activateFlashlight() {
  document.body.classList.add('flashlight-active');
  cameraFlashlight.classList.add('bxs-sun');
  cameraFlashlight.classList.remove('bx-sun');
  flashlightAnimation();
  flashlightState = true;
}

export function deactivateFlashlight() {
  document.body.classList.remove('flashlight-active');
  cameraFlashlight.classList.add('bx-sun');
  cameraFlashlight.classList.remove('bxs-sun');
  flashlightAnimation();
  flashlightState = false;
}


cameraFlashlight.addEventListener('click', () => {
  if (!flashlightState) {
    activateFlashlight();
  } else {
    deactivateFlashlight();
  }
})
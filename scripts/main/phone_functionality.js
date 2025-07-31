import { phoneUnlock } from '../lock_screen/phone_unlock.js';
import { constants } from '../utils/dom_constants.js';
import { setDisplay } from '../utils/dom_selectors.js';
import { closeApp } from '../home_screen/homescreen_functionality.js';

const { phoneEl, unlockKey, phonePointer, closeAppBtn } = constants;

export function activateLockKeyFunctionality() {
unlockKey.addEventListener('click', phoneUnlock);
}

// Phone Pointer Functionality

export function trackMouse(e) {
  let x = e.clientX - window.innerWidth / 2;
  let y = e.clientY - window.innerHeight / 2;

  return {
    x,
    y
  }
}

function activatePointer(e) {
  let { x, y } = trackMouse(e);
  setDisplay(phonePointer, 'initial');
  phonePointer.style.transform = `translateX(${x}px) translateY(${y}px)`;
}

let animationFrameId = null;

function onMouseMove(e) {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  animationFrameId = requestAnimationFrame(() => activatePointer(e));
}

function deactivatePointer() {
  setDisplay(phonePointer, 'none');
}

export function addPointer() {
  phoneEl.addEventListener('mouseover', () => {
    phoneEl.addEventListener('mousemove', onMouseMove)
  })

  phoneEl.addEventListener('mouseleave', () => {
    deactivatePointer();
    phoneEl.removeEventListener('mousemove', onMouseMove);
  })
}


// Phone Back Button

export function activateCloseAppButton() {
  closeAppBtn.addEventListener('click', () => {
    const app = constants.currentScreen.app;
    if (app) {
      closeApp(app);
      closeAppBtn.classList.remove('close-app-button-active');
    }
  })
}

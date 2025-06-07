import { phoneUnlock } from '../lock_screen/phone_unlock.js';
import { constants } from '../utils/dom_constants.js';
import { setDisplay } from '../utils/dom_selectors.js';

const { phoneEl, unlockBtn, phonePointer } = constants;

export function activateLockBtnFunctionality() {
unlockBtn.addEventListener('click', phoneUnlock);
phoneUnlock();
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
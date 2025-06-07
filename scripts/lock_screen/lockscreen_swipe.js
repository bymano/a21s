import { passwordScreenUnlock } from '../password_screen/password_functionality.js';
import { lockscreenLock } from './lockscreen_functionality.js';
import { constants } from '../utils/dom_constants.js';

// Phone Content Element

const { phoneLockscreenContent } = constants;

// Swipe tracking variables

let initialX;
let initialY;
let finalX;
let finalY;

// 150 is just preference. Not strictly.

const unlockPoint = 150;

function changeLockscreenOpacity(e) {
  // Get absolute difference between points
  
  const moveX = Math.abs(initialX - e.clientX);
  const moveY = Math.abs(initialY - e.clientY);
  
  // Compare the initial pointer position to the current one
  // 0.0066 because the unlockPoint is 150 (1 / 150 = 0.0066)
  // Opacity fades to 0 as swipe distance approaches 300px

  phoneLockscreenContent.style.opacity = moveX > moveY ? (1 - moveX * (1 / unlockPoint)) : (1 - moveY * (1 / unlockPoint));
}

export function startSwipeTracking(e) {
  e.preventDefault();
  // Save initial pointer position on press
  initialX = e.clientX;
  initialY = e.clientY;

  // Compare on each pointer move
  phoneLockscreenContent.addEventListener('pointermove', changeLockscreenOpacity)
}

// Reset opacity and stop tracking if pointer leaves phone screen

export function stopTrackingOnLeave() {
  phoneLockscreenContent.style.opacity = 1;
  phoneLockscreenContent.removeEventListener('pointermove', changeLockscreenOpacity);
}

// On pointer release, unlock if swipe distance >= 300px

export function endSwipeTracking(e) {
  phoneLockscreenContent.style.opacity = 1;
  finalX = e.clientX;
  finalY = e.clientY;

  if (Math.abs(initialY - finalY) > unlockPoint || Math.abs(initialX - finalX) > unlockPoint) {
    lockscreenLock();
    passwordScreenUnlock();
  }

  // Stop tracking after unlock
  phoneLockscreenContent.removeEventListener('pointermove ', changeLockscreenOpacity);
}
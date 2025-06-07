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

// 300 is just preference. Not strictly.

const unlockPoint = 300;

function changeLockscreenOpacity(e) {

  // Get absolute difference between points

  const moveX = Math.abs(initialX - e.clientX);
  const moveY = Math.abs(initialY - e.clientY);

  // Compare the initial mouse position to the current one
  // 0.0033 because the unlockPoint is 300 (1 / 300 is 0.0033)
  // Opacity fades to 0 as swipe distance approaches 300px

  phoneLockscreenContent.style.opacity = moveX > moveY ? (1 - moveX * 0.0033) : (1 - moveY * 0.0033);
}

export function startSwipeTracking(e) {
  e.preventDefault();
  // Save initial mouse position on press
  initialX = e.clientX;
  initialY = e.clientY;

  // Compare on each mouse move
  phoneLockscreenContent.addEventListener('mousemove', changeLockscreenOpacity)
}

// Reset opacity and stop tracking if mouse leaves phone screen

export function stopTrackingOnLeave() {
  phoneLockscreenContent.style.opacity = 1;
  phoneLockscreenContent.removeEventListener('mousemove', changeLockscreenOpacity);
}

// On mouse release, unlock if swipe distance >= 300px

export function endSwipeTracking(e) {
  phoneLockscreenContent.style.opacity = 1;
  finalX = e.clientX;
  finalY = e.clientY;

  if (Math.abs(initialY - finalY) > unlockPoint || Math.abs(initialX - finalX) > unlockPoint) {
    lockscreenLock();
    passwordScreenUnlock();
  }

  // Stop tracking after unlock
  phoneLockscreenContent.removeEventListener('mousemove', changeLockscreenOpacity);
}
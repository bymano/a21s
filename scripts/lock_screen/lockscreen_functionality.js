import { passwordScreenUnlock } from '../password_screen/password_functionality.js';
import { runDateAndTime } from '../utils/time_date.js';
import { activateCamera, deactivateCamera } from './camera.js';
import { startSwipeTracking, stopTrackingOnLeave, endSwipeTracking} from './lockscreen_swipe.js';
import { constants } from '../utils/dom_constants.js';
import { setDisplay } from '../utils/dom_selectors.js';

const { phoneLockscreenContent, secondaryLockscreenContent, lockscreenDateEl, lockscreenTimeEl, cameraApp, cameraEl, closeAppBtn } = constants;

export function activateLockscreenFunctionality() {
  // Time and Date
  runDateAndTime(lockscreenDateEl, lockscreenTimeEl);

  // Webcam

  cameraApp.addEventListener('click', () => activateCamera(cameraEl))

  // Swipe functionality
  phoneLockscreenContent.addEventListener('pointerdown', startSwipeTracking);
  // Reset opacity and stop tracking if pointer leaves phone screen
  phoneLockscreenContent.addEventListener('pointerleave', stopTrackingOnLeave);

  phoneLockscreenContent.addEventListener('pointerup', e => {
    endSwipeTracking(e, () => {
      lockscreenLock();
      passwordScreenUnlock();
    })
  });
}

export function lockscreenLock() {
  // Turn off phone & Wallpapers
  setDisplay(phoneLockscreenContent, 'none');
  secondaryLockscreenContent.classList.add('o-n');

  // Turn off webcam (If turned on)
  deactivateCamera(cameraEl);
  setDisplay(cameraEl, 'none');
  closeAppBtn.classList.remove('close-app-button-active');
}

export function lockscreenUnlock() {
  // Turn on phone & Wallpaper
  setDisplay(phoneLockscreenContent, 'initial')
  setTimeout(() => {
    secondaryLockscreenContent.classList.remove('o-n');
  }, 25)
}
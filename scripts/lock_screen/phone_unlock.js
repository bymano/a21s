import { lockscreenLock, lockscreenUnlock } from './lockscreen_functionality.js';
import { passwordScreenLock } from '../password_screen/password_functionality.js';
import { homescreenLock } from '../home_screen/homescreen_functionality.js';
import { constants } from '../utils/dom_constants.js';
import { setDisplay } from '../utils/dom_selectors.js';

const { wallpaperEl } = constants;

// Tracking the phone's lock status (true = locked, false = unlocked)
let phoneLocked = true;

export function phoneUnlock() {
  
  if (constants.currentScreen === 'passwordscreen') {
    passwordScreenLock();
  } else if (constants.currentScreen === 'homescreen') {
    homescreenLock();
    document.querySelectorAll('.phone-content-app').forEach(appEl => {
      setDisplay(appEl, 'none');
    })
    wallpaperEl.src = 'images/wallpaper-4.jpeg';
  }
  
  if (constants.currentScreen !== 'lockscreen') {
    constants.currentScreen = 'lockscreen';
  }
  
  if (!phoneLocked) {
    lockscreenLock();
    setDisplay(wallpaperEl, 'none')
  } else {
    lockscreenUnlock();
    setDisplay(wallpaperEl, 'initial')
  }
  phoneLocked = !phoneLocked;
}
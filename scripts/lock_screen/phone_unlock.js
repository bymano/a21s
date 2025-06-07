import { lockscreenLock, lockscreenUnlock } from './lockscreen_functionality.js';
import { passwordScreenLock } from '../password_screen/password_functionality.js';
import { constants } from '../utils/dom_constants.js';
import { setDisplay } from '../utils/dom_selectors.js';
import { appLock } from '../utils/app_unlock.js';

const { wallpaperEl, phonePasswordScreenContent, phoneHomescreenContent } = constants;

// Tracking the phone's lock status (true = locked, false = unlocked)
let phoneLocked = true;

export function phoneUnlock() {
  
  if (constants.currentScreen.main === phonePasswordScreenContent) {
    passwordScreenLock();
  } else if (constants.currentScreen.main === phoneHomescreenContent || constants.currentScreen.app) {
    appLock(phoneHomescreenContent);
    constants.currentScreen.app = false;
    document.querySelectorAll('.phone-content-app').forEach(appEl => {
      setDisplay(appEl, 'none');
    })
    wallpaperEl.src = 'images/wallpaper-4.jpeg';
  }
  
  if (constants.currentScreen.main !== phonePasswordScreenContent) {
    constants.currentScreen.main = phonePasswordScreenContent;
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
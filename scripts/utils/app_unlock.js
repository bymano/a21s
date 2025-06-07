import { unlockAnimation } from './lock_unlock_animation.js';
import { setDisplay } from './dom_selectors.js';

export function appUnlock(mainScreen, secondaryScreen) {
  setDisplay(mainScreen, 'initial');
  unlockAnimation(secondaryScreen);
}

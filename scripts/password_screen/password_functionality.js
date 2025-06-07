import { homescreenUnlock } from '../home_screen/homescreen_functionality.js';
import { lockAnimation, unlockAnimation } from '../utils/lock_unlock_animation.js';
import { constants } from '../utils/dom_constants.js';
import { setDisplay } from '../utils/dom_selectors.js';

const { passwordInput, passwordDelBtn, passwordSubmitBtn, phonePasswordScreenContent, secondaryPasswordScreenContent } = constants;

const enterPinTxt = document.querySelector('.enter-pin');
const pinTipTxt = document.querySelector('.pin-tip');

export function activatePasswordFunctionality() {

  document.querySelectorAll('.password-num-btn').forEach(btn => {
    btn.addEventListener('click', () =>{ 
      enterPinTxt.style.color = 'transparent';
      pinTipTxt.style.color = 'transparent';
      passwordInput.value += btn.textContent;
    });
  });
  
  passwordDelBtn.addEventListener('click', () => {
    let newInput = '';
    for (let i = 0; i < passwordInput.value.length - 1; i++) {
      newInput += passwordInput.value[i];
    }
    passwordInput.value = newInput;
  })
  
  passwordSubmitBtn.addEventListener('click', () => {
    if (passwordInput.value.length >= 4) {
      lockAnimation(secondaryPasswordScreenContent);
      setTimeout(() => {
        passwordScreenLock();
        homescreenUnlock();
      }, 200)
    } else {
      enterPinTxt.style.color = 'white';
      enterPinTxt.textContent = 'Incorrect PIN Entered'
    }
    passwordInput.value = '';
  });
};

// VISUALS

export function passwordScreenUnlock() {
  constants.currentScreen.main = phonePasswordScreenContent;
  setDisplay(phonePasswordScreenContent, 'initial')
  unlockAnimation(secondaryPasswordScreenContent);
}

export function passwordScreenLock() {
  setDisplay(phonePasswordScreenContent, 'none');
  enterPinTxt.textContent = 'Enter PIN';
  enterPinTxt.style.color = '';
  pinTipTxt.style.color = '';
  passwordInput.value = '';
}
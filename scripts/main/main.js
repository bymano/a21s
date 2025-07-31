import { activateLockKeyFunctionality, addPointer, activateCloseAppButton } from './phone_functionality.js';
import { activateLockscreenFunctionality } from '../lock_screen/lockscreen_functionality.js';
import { activatePasswordFunctionality } from '../password_screen/password_functionality.js';
import { activateHomescreenFunctionality } from '../home_screen/homescreen_functionality.js';
import { loadHomescreenApps } from '../home_screen/homescreen_functionality.js';

// Phone Keys
activateLockKeyFunctionality();


// Phone Pointer
addPointer();

// Close App Button
activateCloseAppButton();

// Lock Screen Functionality
activateLockscreenFunctionality()

// Password Screen Functionality
activatePasswordFunctionality();

// Home Screen Functionality
activateHomescreenFunctionality();
loadHomescreenApps()
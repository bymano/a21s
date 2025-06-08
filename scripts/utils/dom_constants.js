import { getElById, getElByClass } from './dom_selectors.js';

// Phone Components
const phoneEl = getElById('phone');
const cameraEl = getElById('webcam');
const unlockKey= getElById('phone-unlock-key');
const phonePointer = getElById('pointer');
const wallpaperEl = getElById('wallpaper');

// Lock screen Components

const phoneLockscreenContent = getElById('lock-screen');
const secondaryLockscreenContent = getElById('secondary-lock-screen');
const lockscreenTimeEl = getElById('lockscreen-time');
const lockscreenDateEl = getElById('lockscreen-date');
const cameraApp = getElByClass('phone-camera-app');
const cameraFlashlight = getElById('flashlight');

// Password Screen Components

const phonePasswordScreenContent = getElById('password-screen');
const secondaryPasswordScreenContent = getElById('secondary-password-screen');
const passwordInput = document.getElementById('password-input');
const passwordDelBtn = document.getElementById('password-delete-button');
const passwordSubmitBtn = document.getElementById('password-submit-button');

// Home Screen Components
const phoneHomescreenContent = getElById('home-screen');
const secondaryHomescreenContent = getElById('secondary-home-screen');
const homescreenTimeEl = getElById('homescreen-time');
const homescreenAppGrid = getElByClass('app-grid');
const closeAppBtn = getElById('close-app');

let currentScreen = {
  main: phoneLockscreenContent,
  app: false
}


export const constants = {
  phoneEl,
  unlockKey,
  phonePointer,
  currentScreen,
  wallpaperEl,
  cameraEl,
  phoneLockscreenContent,
  secondaryLockscreenContent,
  lockscreenTimeEl,
  lockscreenDateEl,
  cameraApp,
  cameraFlashlight,
  phonePasswordScreenContent,
  secondaryPasswordScreenContent,
  passwordInput,
  passwordDelBtn,
  passwordSubmitBtn,
  phoneHomescreenContent,
  secondaryHomescreenContent,
  closeAppBtn,
  homescreenTimeEl,
  homescreenAppGrid
}
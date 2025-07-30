import { runTime } from '../utils/time_date.js';
import { unlockAnimation } from '../utils/lock_unlock_animation.js';
import { apps } from './data/apps.js';
import { constants } from '../utils/dom_constants.js';
import { setDisplay } from '../utils/dom_selectors.js';
import { appLock } from '../utils/app_unlock.js';

const { phoneHomescreenContent, secondaryHomescreenContent, homescreenTimeEl, homescreenAppGrid, wallpaperEl, closeAppBtn } = constants;  

export function activateHomescreenFunctionality() {
  runTime(homescreenTimeEl);
}

export function homescreenUnlock() {
  constants.currentScreen.main = phoneHomescreenContent;
  setDisplay(phoneHomescreenContent, 'initial');
  wallpaperEl.src = 'images/wallpaper-3.jpeg';
  unlockAnimation(homescreenAppGrid);
}

export function closeApp(app) {
  setDisplay(app, 'none');
  setDisplay(phoneHomescreenContent, 'initial');
  constants.currentScreen.main = phoneHomescreenContent;
}


export function loadHomescreenApps() {
  apps.forEach((app) => {
    // App Button
    const appEl = document.createElement('button');
    appEl.classList.add('app');
    appEl.ariaLabel = `Open ${app.name} App`;
    appEl.addEventListener('click', () => {
      if (!app.openFunc) {
        window.open(`https://www.${app.name !== "Camera" ? app.name : "webcamtoy"}.com`);
        return;
      }
      unlockAnimation(secondaryHomescreenContent)
      setTimeout(() => {
        appLock(phoneHomescreenContent);
        app.openFunc();
        closeAppBtn.classList.add('close-app-button-active');
      }, 25)
    })
    
    // App Image
    const appImg = document.createElement('img');
    appImg.src = app.imagePath;
    appImg.alt = `${app.name} App Icon`;
    appEl.appendChild(appImg);
    
    // App Name
    const appName = document.createElement('p');
    if (app.name.length > 8) {
      let appNameTxt = '';
      for (let i = 0; i < app.name.length; i++) {
        if (i === 8) {
          appNameTxt += '...';
          break;
        }
        appNameTxt += app.name[i];
      }
      appName.textContent = appNameTxt;
    } else {
      appName.textContent = app.name;
    }
    
    appName.ariaLabel = 'App Label';
    appEl.appendChild(appName);
    
    
    // Complete Append
    homescreenAppGrid.appendChild(appEl);
  })
}
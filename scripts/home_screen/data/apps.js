import { getElById } from '../../utils/dom_selectors.js';
import { appUnlock } from '../../utils/app_unlock.js';
import { constants } from '../../utils/dom_constants.js';

export const apps = [

  {
    name: 'Calculator',
    imagePath: 'images/apps/calculator.webp',
    }, {
    name: 'Weather',
    imagePath: 'images/apps/weather.webp',
  }, {
    name: 'Clock',
    imagePath: 'images/apps/clock.webp',
  }, {
    name: 'Chrome',
    imagePath: 'images/apps/google-chrome.webp',
  }, {
    name: 'Instagram',
    imagePath: 'images/apps/instagram.webp',
  }, {
    name: 'Snapchat',
    imagePath: 'images/apps/snapchat.webp',
  }, {
    name: 'TikTok',
    imagePath: 'images/apps/tiktok.webp',
  }, {
    name: 'Whatsapp',
    imagePath: 'images/apps/whatsapp.webp',
  }, {
    name: 'Youtube',
    imagePath: 'images/apps/youtube.webp',
  }, {
    name: 'Netflix',
    imagePath: 'images/apps/netflix.webp',
  }, {
    name: 'Notepad',
    imagePath: 'images/apps/notepad.webp',
  }, {
    name: 'Gmail',
    imagePath: 'images/apps/gmail.webp',
  }
]

apps.forEach(app => {
  const mainScreen = getElById(`${app.name.toLowerCase()}-screen`);
  const secondaryScreen = getElById(`secondary-${app.name.toLowerCase()}-screen`);
  if (!mainScreen || !secondaryScreen) return;
    app.openFunc = () => {
      appUnlock(mainScreen, secondaryScreen);
      constants.currentScreen.app = mainScreen;
    }
})
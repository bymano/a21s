import { getElById } from "../../../utils/dom_selectors.js";

const secondHandContainer = getElById("second-hand-container")
const minuteHandContainer = getElById("minute-hand-container")
const hourHandContainer = getElById("hour-hand-container")

function rotateForCurrentTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const secondDeg = (seconds / 60) * 360;
  const minuteDeg = (minutes / 60) * 360 + secondDeg / 60;
  const hourDeg = (hours / 12) * 360 + minuteDeg / 12;

  hourHandContainer.style.transform = `rotate(${hourDeg}deg)`;
  minuteHandContainer.style.transform = `rotate(${minuteDeg}deg)`;
  secondHandContainer.style.transform = `rotate(${secondDeg}deg)`;

}

rotateForCurrentTime();
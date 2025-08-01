const secondHandContainer = document.getElementById("second-hand-container");
const minuteHandContainer = document.getElementById("minute-hand-container");
const hourHandContainer = document.getElementById("hour-hand-container");

function rotateForCurrentTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const minuteDeg = (minutes / 60) * 360;
  const hourDeg = (hours / 12) * 360 + minuteDeg / 12;
  const secondDeg = (seconds / 60) * 360;

  hourHandContainer.style.transform = `rotate(${hourDeg}deg)`;
  minuteHandContainer.style.transform = `rotate(${minuteDeg}deg)`;
  secondHandContainer.style.transform = `rotate(${secondDeg}deg)`;

}

rotateForCurrentTime();
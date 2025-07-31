const secondHand = document.getElementById("clock-second-hand");
const minuteHand = document.getElementById("clock-minute-hand");
const hourHand = document.getElementById("clock-hour-hand");

function rotateForCurrentTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const minuteDeg = (minutes / 60) * 360;
  const hourDeg = (hours / 12) * 360 + minuteDeg / 12;
  const secondDeg = (seconds / 60) * 360;

  hourHand.style.transform = `rotate(${hourDeg}deg)`;
  minuteHand.style.transform = `rotate(${minuteDeg}deg)`;
  secondHand.style.transform = `rotate(${secondDeg}deg)`;

}

rotateForCurrentTime();
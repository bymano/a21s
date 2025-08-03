import { getElById } from "../../../utils/dom_selectors.js";

const secondHandContainer = getElById("second-hand-container")
const minuteHandContainer = getElById("minute-hand-container")
const hourHandContainer = getElById("hour-hand-container")
const createAlarmBtn = getElById("clock-add-alarm");
const createAlarmPage = getElById("create-alarm-page");
const closeCreateAlarmPageBtn = getElById("create-alarm-back-button");
const cancelCreateAlarmPageBtn = getElById("create-alarm-cancel")
const createAlarmPageHour = getElById("create-alarm-time-hour");
const createAlarmPageMinute = getElById("create-alarm-time-minute");
const saveCreateAlarmPageBtn = getElById("create-alarm-approve");
const toggleButtons = document.querySelectorAll(".clock-toggle-button");

toggleButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    if (btn.dataset.state === "off") {
      btn.dataset.state = "on"
    } else {
      btn.dataset.state = "off";
    }
  })
})

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const alarms = [{
  active: false,
  time: "",
  repeat: [],
  ringtone: "default",
  vibrate: true,
  label: ""
}];

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

function openCreateAlarmPage() {
  createAlarmPage.classList.add("create-alarm-page-active");

  const now = new Date();
  let hours = now.getHours();
  hours = hours % 12 || 12;
  if (hours < 10) hours = "0" + hours;  
  let minutes = now.getMinutes();
  if (minutes < 10) minutes = "0" + minutes;
  
  createAlarmPageHour.textContent = hours;
  createAlarmPageMinute.textContent = minutes;
}
function closeCreateAlarmPage() {
  createAlarmPage.classList.remove("create-alarm-page-active");
}

createAlarmBtn.addEventListener("click", openCreateAlarmPage)

closeCreateAlarmPageBtn.addEventListener("click", closeCreateAlarmPage);
cancelCreateAlarmPageBtn.addEventListener("click", closeCreateAlarmPage);

saveCreateAlarmPageBtn.addEventListener("click", () => {
  alarms.push({
    active: false,
    time: "",
    repeat: [],
    ringtone: "default",
    vibrate: true,
    label: ""
  })
});

rotateForCurrentTime();
import { getElById, getElByClass, createElement } from "../../../utils/dom_selectors.js";

// --- DOM ELEMENTS ---
const secondHandContainer = getElById("second-hand-container");
const minuteHandContainer = getElById("minute-hand-container");
const hourHandContainer = getElById("hour-hand-container");

const createAlarmBtn = getElById("clock-add-alarm");
const createAlarmPage = getElById("create-alarm-page");
const closeCreateAlarmPageBtn = getElById("create-alarm-back-button");
const cancelCreateAlarmPageBtn = getElById("create-alarm-cancel");
const saveCreateAlarmPageBtn = getElById("create-alarm-approve");

const createAlarmPageHour = getElById("create-alarm-time-hour");
const createAlarmPageMinute = getElById("create-alarm-time-minute");

const vibrateBtn = getElById("clock-vibrate-toggler");

const alarmListContainer = getElByClass("alarm-list-container");

const hourCol = getElByClass("alarm-hour-selection");
const minuteCol = getElByClass("alarm-minute-selection");

const meridiemContainer = document.querySelector(".create-alarm-meridiem");
const meridiemSpans = meridiemContainer.querySelectorAll("span");

// --- STATE ---
let currMeridiem = "";
let currRingtone = "Afternoon of Konoha";
let currLabel = "";
let currPlayingAlarm;

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const alarms = [];

let hourIndex = 2;    // centered item for hours
let minuteIndex = 2;  // centered item for minutes
let meridiemIndex = 0; // 0 = AM, 1 = PM

// --- UTILITY FUNCTIONS ---
function handleClockButtonClick(btn) {
  btn.addEventListener("click", () => {
    btn.dataset.state = btn.dataset.state === "off" ? "on" : "off";
  });
}

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
  let hours = now.getHours() % 12 || 12;
  if (hours < 10) hours = "0" + hours;
  let minutes = now.getMinutes();
  if (minutes < 10) minutes = "0" + minutes;

  createAlarmPageHour.textContent = hours;
  createAlarmPageMinute.textContent = minutes;

  // --- ADDED: Update scroll pickers to match current time ---
  hourIndex = parseInt(hours, 10) - 1;
  minuteIndex = parseInt(minutes, 10);
  updateScrollClass(hourCol, hourIndex);
  updateScrollClass(minuteCol, minuteIndex);
  updateTimeDisplay();
}

function closeCreateAlarmPage() {
  createAlarmPage.classList.remove("create-alarm-page-active");
}

function saveAlarm() {
  alarms.push({
    id: `${Date.now()}`,
    active: true,
    time: {
      hour: createAlarmPageHour.textContent,
      minute: createAlarmPageMinute.textContent,
    },
    timeHTML: `${createAlarmPageHour.textContent}:${createAlarmPageMinute.textContent}`,
    meridiem: currMeridiem,
    repeat: [],
    ringtone: currRingtone,
    vibrate: vibrateBtn.dataset.state,
    label: currLabel,
  });
}

function createAlarmEl(alarmObj) {
  const alarmContainer = createElement("div");
  alarmContainer.classList.add("alarm-container");

  const alarmInfo = createElement("div");
  alarmInfo.classList.add("alarm-info");

  const alarmTime = createElement("p");
  alarmTime.classList.add("alarm-time");
  alarmTime.textContent = alarmObj.timeHTML;

  const alarmDay = createElement("p");
  alarmDay.classList.add("alarm-day");
  alarmDay.textContent = "Tomorrow";

  alarmInfo.append(alarmTime, alarmDay);

  const alarmToggle = createElement("div");
  alarmToggle.classList.add("alarm-toggle");

  const alarmToggleBtn = createElement("button");
  alarmToggleBtn.id = `alarm-toggle-${alarmObj.id}`;
  alarmToggle.dataset.id = `${alarmObj.id}`;
  alarmToggleBtn.classList.add("clock-toggle-button");
  alarmToggleBtn.dataset.state = alarmObj.active ? "on" : "off";
  alarmToggleBtn.addEventListener("click", () => {
    alarmObj.active = !alarmObj.active;
  });
  handleClockButtonClick(alarmToggleBtn);

  const alarmToggleBtnDiv = createElement("div");

  alarmToggleBtn.appendChild(alarmToggleBtnDiv);
  alarmToggle.appendChild(alarmToggleBtn);
  alarmContainer.append(alarmInfo, alarmToggle);

  alarmListContainer.appendChild(alarmContainer);
}

function activateAlarms() {
  setInterval(() => {
    alarms.forEach(alarm => {
      if (!alarm.active) return;

      const now = new Date();
      let currHour = now.getHours() % 12 || 12;
      if (currHour < 10) currHour = "0" + currHour;
      let currMinute = now.getMinutes();
      if (currMinute < 10) currMinute = "0" + currMinute;

      if (alarm.time.hour == currHour && alarm.time.minute == currMinute) {
        if (currPlayingAlarm) currPlayingAlarm.pause();
        currPlayingAlarm = new Audio("audios/afternoon_of_konoha.mp3");
        currPlayingAlarm.loop = false;
        console.log(alarm.active)
        currPlayingAlarm.play();

        if (alarm.time.vibrate === "on") navigator.vibrate([500, 200, 500]);

        alarm.active = false;
        getElById(`alarm-toggle-${alarm.id}`).dataset.state = "off";
      }
    });
  }, 1000);
}

// --- TIME PICKER FUNCTIONS ---
function populateTimeColumns() {
  for (let i = 1; i <= 12; i++) {
    const span = document.createElement("span");
    span.textContent = i.toString().padStart(2, "0");
    hourCol.appendChild(span);
  }

  for (let i = 0; i < 60; i++) {
    const span = document.createElement("span");
    span.textContent = i.toString().padStart(2, "0");
    minuteCol.appendChild(span);
  }
}

function updateTimeDisplay() {
  const hourEls = hourCol.querySelectorAll("span");
  const minuteEls = minuteCol.querySelectorAll("span");
  createAlarmPageHour.textContent = hourEls[hourIndex]?.textContent || "";
  createAlarmPageMinute.textContent = minuteEls[minuteIndex]?.textContent || "";
}

function updateScrollClass(col, index) {
  const spans = col.querySelectorAll("span");

  spans.forEach((span, i) => {
    if (i >= index - 2 && i <= index + 2) {
      span.style.display = "inline-block";
    } else {
      span.style.display = "none";
    }
    span.className = "";
    span.style.transform = "scale(1)";
    span.style.opacity = "0.4";
  });

  for (let offset = -2; offset <= 2; offset++) {
    const pos = index + offset;
    if (pos < 0 || pos >= spans.length) continue;

    let scale = 1;
    let opacity = 1;
    let cls = "";

    switch (offset) {
      case -2:
        cls = "first";
        scale = 1;
        opacity = 0.6;
        break;
      case -1:
        cls = "second";
        scale = 1.2;
        opacity = 0.8;
        break;
      case 0:
        cls = "third";
        scale = 1.5;
        opacity = 1;
        break;
      case 1:
        cls = "fourth";
        scale = 1.2;
        opacity = 0.8;
        break;
      case 2:
        cls = "fifth";
        scale = 1;
        opacity = 0.6;
        break;
    }

    spans[pos].className = cls;
    spans[pos].style.transition = "transform 0.3s ease, opacity 0.3s ease";
    spans[pos].style.transform = `scale(${scale})`;
    spans[pos].style.opacity = opacity;
  }

  // const grandparent = col.parentElement.parentElement;
  // const containerWidth = grandparent.offsetWidth;
  // const targetLeft = spans[index].offsetLeft;
  // const targetWidth = spans[index].offsetWidth;
  // const scrollTo = targetLeft - containerWidth / 2 + targetWidth / 2;

  // col.style.transition = "transform 13s ease";
  // col.style.transform = `translateX(${-scrollTo}px)`;
}

function handleSwipe(col, isHour = true) {
  let startX = 0;
  let isDragging = false;

  col.addEventListener("pointerdown", e => {
    isDragging = true;
    startX = e.clientX;
  });

  window.addEventListener("pointermove", e => {
    if (!isDragging) return;
    const diff = e.clientX - startX;

    if (diff > 25) {
      if (isHour && hourIndex > 0) hourIndex--;
      if (!isHour && minuteIndex > 0) minuteIndex--;
      startX = e.clientX;
      updateScrollClass(col, isHour ? hourIndex : minuteIndex);
      updateTimeDisplay();
    } else if (diff < -25) {
      const spans = col.querySelectorAll("span");
      if (isHour && hourIndex < spans.length - 1) hourIndex++;
      if (!isHour && minuteIndex < spans.length - 1) minuteIndex++;
      startX = e.clientX;
      updateScrollClass(col, isHour ? hourIndex : minuteIndex);
      updateTimeDisplay();
    }
  });

  window.addEventListener("pointerup", () => {
    isDragging = false;
  });
}

// --- AM/PM (Meridiem) Swipe Functions ---
function updateMeridiemDisplay() {
  meridiemSpans.forEach((span, i) => {
    if (i === meridiemIndex) {
      span.style.opacity = "1";
      span.style.fontWeight = "700";
      span.style.transform = "scale(1.5)";
      span.style.transition = "transform 0.3s ease, opacity 0.3s ease";
    } else {
      span.style.opacity = "0.4";
      span.style.fontWeight = "400";
      span.style.transform = "scale(1)";
      span.style.transition = "transform 0.3s ease, opacity 0.3s ease";
    }
  });
}

function handleMeridiemSwipe() {
  let startY = 0;
  let isDragging = false;

  meridiemContainer.addEventListener("pointerdown", e => {
    isDragging = true;
    startY = e.clientY;
  });

  window.addEventListener("pointermove", e => {
    if (!isDragging) return;
    const diff = e.clientY - startY;
    if (diff > 25 || diff < -25) {
      meridiemIndex = meridiemIndex === 0 ? 1 : 0; // toggle
      startY = e.clientY;
      updateMeridiemDisplay();
    }
  });

  window.addEventListener("pointerup", () => {
    isDragging = false;
  });
}

// --- EVENT LISTENERS ---
createAlarmBtn.addEventListener("click", openCreateAlarmPage);
closeCreateAlarmPageBtn.addEventListener("click", closeCreateAlarmPage);
cancelCreateAlarmPageBtn.addEventListener("click", closeCreateAlarmPage);

saveCreateAlarmPageBtn.addEventListener("click", () => {
  saveAlarm();
  createAlarmEl(alarms[alarms.length - 1]);
  closeCreateAlarmPage();
});

handleClockButtonClick(vibrateBtn);

// --- INITIALIZATION ---
rotateForCurrentTime();
activateAlarms();

populateTimeColumns();
handleSwipe(hourCol, true);
handleSwipe(minuteCol, false);
updateScrollClass(hourCol, hourIndex);
updateScrollClass(minuteCol, minuteIndex);
updateTimeDisplay();

updateMeridiemDisplay();
handleMeridiemSwipe();

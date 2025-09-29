import { getElById, getElByClass, createElement } from "../../../utils/dom_selectors.js";
import { constants } from "../../../utils/dom_constants.js"

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
let currRingtone = "Afternoon of Konoha";
let currLabel = "";
let currPlayingAlarm;

const alarms = [];
let hourIndex = 2;
let minuteIndex = 2;
let meridiemIndex = 0; // 0 = AM, 1 = PM

// --- UTILITY FUNCTIONS ---
function handleClockButtonClick(btn) {
  btn.addEventListener("click", () => {
    const isOff = btn.dataset.state === "off";
    btn.dataset.state = isOff ? "on" : "off";
    btn.classList.toggle("clock-toggle-on", isOff);
    btn.classList.toggle("clock-toggle-off", !isOff);
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

  secondHandContainer.style.transform = `rotate(${secondDeg}deg)`;
  minuteHandContainer.style.transform = `rotate(${minuteDeg}deg)`;
  hourHandContainer.style.transform = `rotate(${hourDeg}deg)`;
}

function openCreateAlarmPage() {
  createAlarmPage.classList.add("create-alarm-page-active");

  const now = new Date();
  let hours = now.getHours() % 12 || 12;
  let minutes = now.getMinutes();

  createAlarmPageHour.textContent = hours.toString().padStart(2, "0");
  createAlarmPageMinute.textContent = minutes.toString().padStart(2, "0");

  hourIndex = hours - 1;
  minuteIndex = minutes;
  updateScrollClass(hourCol, hourIndex);
  updateScrollClass(minuteCol, minuteIndex);
  updateTimeDisplay();
}

function closeCreateAlarmPage() {
  createAlarmPage.classList.remove("create-alarm-page-active");
}

function saveAlarm() {
    const selectedMeridiem = document.querySelector(".clock-active-meridiem")?.textContent || "AM";
    alarms.push({
    id: `${Date.now()}`,
    active: true,
    snoozer: false,
    time: {
      hour: createAlarmPageHour.textContent,
      minute: createAlarmPageMinute.textContent,
      meridiem: selectedMeridiem,
    },
    timeHTML: `${createAlarmPageHour.textContent}:${createAlarmPageMinute.textContent}`,
    repeat: [],
    ringtone: currRingtone,
    vibrate: vibrateBtn.dataset.state,
    label: currLabel
  });
}

function createAlarmEl(alarmObj) {
  const alarmContainer = createElement("div");
  alarmContainer.classList.add("alarm-container");
  alarmContainer.id = `alarm-${alarmObj.id}`;

  const alarmInfo = createElement("div");
  alarmInfo.classList.add("alarm-info");

  const alarmTimeMeridiem = createElement("div");
  alarmTimeMeridiem.classList.add("alarm-time-meridiem")
  const alarmTime = createElement("p");
  alarmTime.classList.add("alarm-time");
  alarmTime.textContent = alarmObj.timeHTML;

  const alarmMeridiem = createElement("p");
  alarmMeridiem.classList.add("alarm-meridiem");
  alarmMeridiem.textContent = alarmObj.time.meridiem;

  alarmTimeMeridiem.append(alarmTime, alarmMeridiem);

  const alarmDay = createElement("p");
  alarmDay.classList.add("alarm-day");
  alarmDay.textContent = "Tomorrow";

  alarmInfo.append(alarmTimeMeridiem, alarmDay);

  const alarmToggle = createElement("div");
  alarmToggle.classList.add("alarm-toggle");

  const alarmToggleBtn = createElement("button");
  alarmToggleBtn.id = `alarm-toggle-${alarmObj.id}`;
  alarmToggle.dataset.id = `${alarmObj.id}`;
  alarmToggleBtn.classList.add("clock-toggle-button");
  alarmToggleBtn.dataset.state = alarmObj.active ? "on" : "off";
  alarmToggleBtn.classList.add(alarmObj.active ? "clock-toggle-on" : "clock-toggle-off");
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
    const now = new Date();
    const currMeridiem = now.getHours() >= 12 ? 'PM' : 'AM';
    let currHour = now.getHours() % 12 || 12;
    let currMinute = now.getMinutes();

    currHour = currHour.toString().padStart(2, "0");
    currMinute = currMinute.toString().padStart(2, "0");

    alarms.forEach(alarm => {
      if (!alarm.active) return;
      if (
        alarm.snoozer ||
        alarm.time.hour == currHour &&
        alarm.time.minute == currMinute &&
        alarm.time.meridiem === currMeridiem
      ) {
        if (currPlayingAlarm) currPlayingAlarm.pause();
        currPlayingAlarm = new Audio("audios/afternoon_of_konoha.mp3");
        currPlayingAlarm.play();
        alarmActionDropdown(alarm, currPlayingAlarm);
        console.log(alarm)
        
        if (alarm.vibrate === "on") navigator.vibrate([500, 200, 500]);

        alarm.active = false;
        const toggleBtn = getElById(`alarm-toggle-${alarm.id}`);
        if (toggleBtn) {
          toggleBtn.dataset.state = "off";
          toggleBtn.classList.remove("clock-toggle-on");
          toggleBtn.classList.add("clock-toggle-off");
        }
      }
    });
  }, 1000);
}

function alarmActionDropdown(alarm) {
  const alarmDropdownContainer = createElement("div");
  alarmDropdownContainer.classList.add("alarm-dropdown-container", "notif-dropdown")
  alarmDropdownContainer.id = `alarm-dropdown-container-${alarm.id}`;


  const alarmLabel = createElement("label");
  alarmLabel.classList.add("alarm-dropdown-container-label")
  alarmLabel.innerHTML = "<i class='bx bx-alarm'></i> Clock";
// 

  const alarmDropdownInformation = createElement("div");
  alarmDropdownInformation.classList.add("alarm-dropdown-information");

  const alarmInformationLabel = createElement("label");
  alarmInformationLabel.innerHTML = "Alarm <br>";

  const alarmInformationSpan = createElement("span");
  alarmInformationSpan.textContent = `${alarm.time.hour}:${alarm.time.minute} ${alarm.time.meridiem}`;

  alarmDropdownInformation.append(alarmInformationLabel, alarmInformationSpan)
// 
  const alarmDropdownAction = createElement("div");
  alarmDropdownAction.classList.add("alarm-dropdown-action");

  const snoozeButton = createElement("button")
  snoozeButton.classList.add("alarm-snooze-button")
  snoozeButton.dataset.parentId = alarm.id;
  snoozeButton.textContent = "SNOOZE";
  const snoozeTimeoutMS = 5000;
  snoozeButton.addEventListener("click", () => {
  const clonedAlarm = {
    ...alarm, // clone current alarm context
    id: `${Date.now()}`, // new ID for new dropdown
    snoozer: true,
  };

  // Stop current alarm
  currPlayingAlarm.pause();
  currPlayingAlarm.src = "";

  // Remove dropdown
  alarmDropdownContainer.remove();

  // Schedule alarm again in 10 minutes
  setTimeout(() => {
    currPlayingAlarm = new Audio("audios/afternoon_of_konoha.mp3");
    currPlayingAlarm.play();
    alarmActionDropdown(clonedAlarm);

    if (clonedAlarm.vibrate === "on") navigator.vibrate([500, 200, 500]);
  }, snoozeTimeoutMS);
});

  const dismissButton = createElement("button")
  dismissButton.classList.add("alarm-dismiss-button")
  dismissButton.textContent = "DISMISS";
  dismissButton.addEventListener("click", () => {
    currPlayingAlarm.pause();
    currPlayingAlarm.src = "";
    alarmDropdownContainer.remove();
  })

  alarmDropdownAction.append(snoozeButton, dismissButton)
// 

  alarmDropdownContainer.append(alarmLabel, alarmDropdownInformation, alarmDropdownAction)

  constants.phoneEl.appendChild(alarmDropdownContainer)

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      alarmDropdownContainer.style.top = 0;
    });
  });
}

// --- TIME PICKER ---
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
    span.style.display = i >= index - 2 && i <= index + 2 ? "inline-block" : "none";
    span.className = "";
  });

  const classMap = ["first", "second", "third", "fourth", "fifth"];
  for (let offset = -2; offset <= 2; offset++) {
    const pos = index + offset;
    if (pos < 0 || pos >= spans.length) continue;
    spans[pos].classList.add(classMap[offset + 2]);
  }
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
    const spans = col.querySelectorAll("span");

    if (diff > 25) {
      if (isHour && hourIndex > 0) hourIndex--;
      if (!isHour && minuteIndex > 0) minuteIndex--;
      startX = e.clientX;
    } else if (diff < -25) {
      if (isHour && hourIndex < spans.length - 1) hourIndex++;
      if (!isHour && minuteIndex < spans.length - 1) minuteIndex++;
      startX = e.clientX;
    }

    updateScrollClass(col, isHour ? hourIndex : minuteIndex);
    updateTimeDisplay();
  });

  window.addEventListener("pointerup", () => isDragging = false);
}

// --- Meridiem Swiper ---
function updateMeridiemDisplay() {
  meridiemSpans.forEach((span, i) => {
    span.classList.toggle("clock-active-meridiem", i === meridiemIndex);
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
    if (Math.abs(diff) > 25) {
      meridiemIndex = meridiemIndex === 0 ? 1 : 0;
      updateMeridiemDisplay();
      startY = e.clientY;
    }
  });

  window.addEventListener("pointerup", () => isDragging = false);
}

// --- INIT ---
createAlarmBtn.addEventListener("click", openCreateAlarmPage);
closeCreateAlarmPageBtn.addEventListener("click", closeCreateAlarmPage);
cancelCreateAlarmPageBtn.addEventListener("click", closeCreateAlarmPage);

saveCreateAlarmPageBtn.addEventListener("click", () => {
  saveAlarm();
  createAlarmEl(alarms[alarms.length - 1]);
  closeCreateAlarmPage();
});

handleClockButtonClick(vibrateBtn);

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
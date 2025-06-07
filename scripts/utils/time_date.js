export function getTime() {
  const date = new Date();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  
  // If minutes is single digit, add 0 before (Formatting reasons)

  if (hours < 10) {
    hours = '0' + hours;
  }
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  
  return `${hours}:${minutes}`;
}

function getDate() {
  const date = new Date();

  // Days and Months arrays needed because date methods return integers here

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const day = days[date.getDay()];
  const dayNumber = date.getDate();
  const month = months[date.getMonth()];
  return (`${day}, ${dayNumber} ${month}`)
}

function getDateAndTime(dateEl, timeEl) {
  if (dateEl) {
  dateEl.textContent = getDate();
  }
  if (timeEl) {
  timeEl.textContent = getTime();
  }
}

export function runDateAndTime(dateEl, timeEl) {
  getDateAndTime(dateEl, timeEl);
  // Run function every second to ensure correct time
  setInterval(() => {
    getDateAndTime(dateEl, timeEl);
  }, 1000)
}

export function runTime(el) {
  setInterval(() => {
    el.textContent = getTime();
  }, 1000)
}
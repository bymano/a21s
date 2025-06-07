export function unlockAnimation(el) {
  el.classList.add('t-s-125', 'o-n');
  setTimeout(() => {
    el.classList.remove('t-s-125', 'o-n');
  }, 200)
}

export function lockAnimation(el) {
  el.classList.add('t-s-075', 'o-n');
  setTimeout(() => {
    el.classList.remove('t-s-075', 'o-n');
  }, 400)
}
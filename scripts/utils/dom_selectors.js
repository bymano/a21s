export function createElement(el) {
  return document.createElement(el);
}

export function getElById(id) {
  return document.getElementById(id);
}

export function getElByClass(className) {
  return document.querySelector(`.${className}`);
}

export function setDisplay(el, display) {
  // if (!el) return;

  if (display === 'none') {
    el.classList.add('d-n');
    el.classList.remove('d-i');
  } else if (display === 'initial') {
    el.classList.add('d-i');
    el.classList.remove('d-n');
  } else {
    console.error('Display property not valid');
  }
}
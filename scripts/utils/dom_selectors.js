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
  if (!el) return;
  
  if (display === 'none') {
    el.classList.add('d-n');
    el.classList.remove('d-i', 'd-f');
  } else if (display === 'initial') {
    el.classList.add('d-i', 'd-f');
    el.classList.remove('d-n', 'd-f');
  } else if (display === 'flex') {
    el.classList.add('d-f');
    el.classList.remove('d-n', 'd-i');
  } else {
    console.error('Display property not valid');
  }
}
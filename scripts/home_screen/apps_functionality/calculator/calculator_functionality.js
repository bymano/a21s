import { getElById } from '../../../utils/dom_selectors.js';

const calcText = getElById('calculator-text');
const calcTextEqual = getElById('calculator-text-equal');
const clearBtn = getElById('calculator-clear-button');
const equalBtn = getElById('calculator-equal-button');
const deleteBtn = getElById('calculator-delete-button');

let calcString = '';
let operatorPresent = false;
let multiplyOperatorPresent = false;
let charLength = 1;

// Insert Character
function addToCalcString(value) {
  calcString += value;
  calcText.textContent = formatCharacters(calcString);
}

// Format Characters
function formatCharacters(originalString) {
  let newString = '';
  for (let i = 0; i < originalString.length; i++) {
    const currString = originalString[i];
    
    if (currString === '*') {
      newString += '×';
    } else if (currString === '/') {
      newString += '÷';
    } else {
      newString += currString;
    }
  }
  
  return newString;
}
 

document.querySelectorAll('.calculator-button').forEach((btn) => {
    if (btn === equalBtn) { // Equal Button
    btn.addEventListener('click', () => {
      evalCalcString();
    })

  } else if (btn === deleteBtn) { // Delete Button
    btn.addEventListener('click', () => {
      deleteCharacter();
    })

  } else if (btn === clearBtn) { // Clear Button
    btn.addEventListener('click', () => {
      clearCalc();
    })
    
  } else { // Other Buttons
    btn.addEventListener('click', () => {
      if (Number(btn.value) >= 0) { // Numbers
        addToCalcString(btn.value);
        operatorPresent = false;
        multiplyOperatorPresent = false;
      } else if (btn.value === '-' && multiplyOperatorPresent) {
        addToCalcString(btn.value);
        multiplyOperatorPresent = false;
      } else if (!operatorPresent) { // Operators
        addToCalcString(btn.value);
        operatorPresent = true;
        multiplyOperatorPresent = btn.value === '*';
      }
    })
  }
})


// Clear
function clearCalc() {
  calcString = '';
  calcTextEqual.textContent = '';
  calcText.textContent = calcString;
  operatorPresent = false;
  multiplyOperatorPresent = false;
}

// Evaluation
function evalCalcString() {
  try {
    // Assure string can be evaluated
    if (calcString == eval(calcString)) throw error;
    calcTextEqual.textContent = eval(calcString);
  } catch {};
}

// Deletion
function deleteCharacter() {
  if (operatorPresent) { 
    charLength = 3; // Operators take up 3 strings in length
  } else {
    charLength = 1; 
  }
  let newString = '';
  for (let i = 0; i < calcString.length - 1; i++) {
    newString += calcString[i];
  }
  
  operatorPresent = !(Number(newString[newString.length - 1]) >= 0)
  multiplyOperatorPresent = newString[newString.length - 1] === '*'
  calcString = newString;
  calcText.textContent = formatCharacters(newString);
}

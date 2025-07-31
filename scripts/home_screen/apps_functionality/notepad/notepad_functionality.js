import { createElement, getElByClass, getElById } from '../../../utils/dom_selectors.js';
import { getTime } from '../../../utils/time_date.js';
import { notes } from './data/notes.js';

const notesContainer = getElByClass('notes-container');
const noteEditPage = getElByClass('note-edit');
const selectListGrid = getElByClass('select-list-grid');
// Create Page Areas
const createNoteButton = getElByClass('add-note');
// Edit Page Areas
const editNoteBack = getElById('note-edit-back');
const editNoteCheck = getElById('note-edit-check');
const editNoteOptions = getElById('note-edit-options');
const editNoteTitle = getElById('note-edit-input-title');
const editNoteText = getElById('note-edit-input-text');

let mainId = parseInt(localStorage.getItem('mainId')) || 0;
saveNotes();
for (let i = 0; i < notes.length; i++) {
  const note = notes[i];
  if (isEmpty(note.title) && isEmpty(note.text)) {
    deleteNote(note.id);
    saveMainId()
  }
}
saveNotes();

let editorId = null;
let editorCreate = false;

// Set the maximum visible length for the title length and text length
let maxLen = 20;

// Corresponds the layout with it's maximum length.
function updateMaxLen() {
  maxLen = notesContainer.classList.contains('notes-container-grid') ? 20 : 6
}

// Add the notes array elements that are not found in the DOM.
function updateNotes() {
  notes.forEach(note => {
    if (!document.getElementById(`article-${note.id}`)) createNote(note.id, note.title, note.date, note.text, maxLen);
  });
}
updateNotes();

// Remove all the elements from DOM, then render them all again from the notes array.
function rerenderNotes() {
  const allNotes = document.querySelectorAll('.note');
  allNotes.forEach(note => note.remove());
  updateNotes();
}

// Save notes array to localStorage
function saveNotes() {
  localStorage.setItem('notes', JSON.stringify(notes));
}

// Add or Subtract from the mainId
function saveMainId(op) {
  if (op === 'add') {
  localStorage.setItem('mainId', mainId + 1);
  } else if (op === 'subtract') {
  localStorage.setItem('mainId', mainId - 1);
  }
  mainId = parseInt(localStorage.getItem('mainId'));
}

// Add note to the notes array, render them in the DOM, save then to localStorage, and increment the mainId
function addNote(id, title, date, text) {
  notes.push({
    id: id,
    title: title.trim(),
    date: date,
    text: text.trim(),
  })

  updateNotes();
  saveNotes();
  saveMainId('add');
}

// Add note to the DOM.
function createNote(id, title, date, text) {
  const currId = id;
  const newNote = createElement('article');
  newNote.id = 'article-' + currId;
  newNote.classList.add('note');
  
  const noteTitle = createElement('p');
  noteTitle.id = 'note-title-' + currId;
  noteTitle.classList.add('note-title');
  if (isEmpty(title)) {
    noteTitle.textContent = 'No Title';
  } else {
    noteTitle.textContent = cutString(title.trim(), maxLen);
  }
  
  const noteInfoContainer = createElement('section');
  noteInfoContainer.classList.add('note-info-container');
  noteInfoContainer.id = 'note-info-container-' + currId;
  
  const noteDate = createElement('p');
  noteDate.id = 'note-date-' + currId;
  noteDate.classList.add('note-info');
  noteDate.textContent = date;
  
  const noteText = createElement('p');
  noteText.id = 'note-text-' + currId;
  noteText.classList.add('note-info');
  noteText.textContent = cutString(text.trim(), maxLen)
  
  noteInfoContainer.append(noteDate, noteText);
  
  newNote.append(noteTitle, noteInfoContainer);
  newNote.addEventListener('click', (e) => {
    openEditNote(Number(e.target.id[e.target.id.length - 1]));
  })
  notesContainer.prepend(newNote)
}

// Check if string is empty
function  isEmpty(str) {
  return str.trim() === '';
}


// Check note editing page, corresponding with the element clicked, or if a new note is made.
function openEditNote(id) {
  editorId = id;
  noteEditPage.classList.add('note-create-edit-active');
  if (notes[id].background) noteEditPage.style.backgroundImage = `url(${notes[id].background})`;
  const title = notes[id].title;
  const text = notes[id].text;
  if (title !== 'No Title') editNoteTitle.value = title;
  editNoteText.value = text;
  editNoteText.focus();
}

// Remove note from the DOM, then from the notes array
function deleteNote(id) {
  document.getElementById(`article-${id}`)?.remove();
  saveMainId('subtract');
  for (let i = 0; i < notes.length; i++) {
    const note = notes[i];
    if (note.id === id) {
      notes.splice(i, 1);
      i--;
    }
    if (note.id > id) note.id--;
  }
}

// Check if corresponding id is in the DOM, if not add it.
// Get title and text from input fields, if they're too long then cut them, if they're empty then delete it, save to storage, and rerender the notes. (If only title is empty, title become 'No Title')
// Update the DOM title and text to the value of the input fields.
// Update the array element's title and text to the value of input fields.
function editNote(id) {
  let title = document.getElementById(`note-title-${id}`);
  let text = document.getElementById(`note-text-${id}`);
  if (!title && !text) {
    addNote(mainId, editNoteTitle.value, getTime(), editNoteText.value);
  }
  title = document.getElementById(`note-title-${id}`);
  text = document.getElementById(`note-text-${id}`);
  
  const editedText = editNoteText.value.trim();
  const editedTitle = editNoteTitle.value.trim();
  let titleStr = cutString(editedTitle, maxLen);
  const textStr = cutString(editedText, maxLen);
  if (isEmpty(titleStr) && !textStr) {
    deleteNote(id);
    saveNotes();
    rerenderNotes();
    return;
  }
  if (isEmpty(titleStr)) titleStr = 'No Title';
  title.textContent = titleStr;
  text.textContent = textStr;
  notes.forEach(note => {
    if (note.id === id) {
      note.title = editedTitle,
      note.text = editedText
    }
  })
}

createNoteButton.addEventListener('click', () => {
  editorCreate = true;
  addNote(mainId, editNoteTitle.value, getTime(), editNoteText.value);
  openEditNote(mainId-1);
  editNoteTitle.focus();
});

editNoteBack.addEventListener('click', () => {
  if (editorCreate) {
    deleteNote(mainId-1);
    saveNotes();
    rerenderNotes();
  } 
  closeEditPage();
})


editNoteCheck.addEventListener('click', () => {
  editNote(editorId);
  saveNotes();
  closeEditPage();
})


function cutString(str, maxLen) {
  if (str.length > maxLen) {
    let cutStr = '';
    for (let i = 0; i < maxLen; i++) {
      cutStr += str[i];
    }
    cutStr += '...';
    return cutStr;
  } else {
    return str;
  }
}

function closeEditPage() {
  closeOptionsFull();
  clearTextareas();
  noteEditPage.classList.remove('note-create-edit-active');
  editorCreate = false;
}

function clearTextareas() {
  editNoteTitle.value = '';
  editNoteText.value = '';
}
function closeOptionsFull() {
  closeOptions();
  noteEditPage.style.backgroundImage = '';
}
function closeOptions() {
  document.querySelector('.note-select-background').classList.remove('note-select-background-active');
}

function toggleOptions() {
  const noteSelectBackground = document.querySelector('.note-select-background');
  const active = 'note-select-background-active';
  
  noteSelectBackground.classList.contains(active)
  ? noteSelectBackground.classList.remove(active)
  : noteSelectBackground.classList.add(active);
}

function selectBackground(el) {
  const bgId = el.id[el.id.length - 1];
  const image = `images/notepad-images/wallpaper-${bgId}.webp`;
  notes.forEach(note => {
    if (note.id === editorId) {
      note.background = image;
      saveNotes();
      noteEditPage.style.backgroundImage = `url(${image})`;
    }
  })
}

editNoteOptions.addEventListener('click', () => {
  toggleOptions();
})

document.querySelectorAll('.background-option').forEach(bg => {
  bg.addEventListener('click', () => {
    selectBackground(bg);
    closeOptions();
  })
})



function toggleListGrid() {
  const grid = 'notes-container-grid';
  if (notesContainer.classList.contains(grid)) {
    selectListGrid.innerHTML = `<i class='bx  bx-list-ul'></i>`;
    notesContainer.style.opacity = 0;
    setTimeout(() => {
      notesContainer.style.opacity = '';
      updateMaxLen();
      rerenderNotes();
      notesContainer.classList.remove(grid);
    }, 250)
  } else {  
    selectListGrid.innerHTML = `<i class='bx  bxs-grid'></i> `;
    notesContainer.style.opacity = 0;
    setTimeout(() => {
      notesContainer.style.opacity = '';
      updateMaxLen();
      rerenderNotes();
      notesContainer.classList.add(grid);
    }, 250)
  }
}

selectListGrid.addEventListener('click', () => {
  toggleListGrid();
})
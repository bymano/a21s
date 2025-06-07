export let notes = null;
notes = JSON.parse(localStorage.getItem('notes'));
if (!notes) {
  notes = [{
    id: 0,
    title: 'Welcome to Notepad',
    date: '06:09',
    text: 'Second application'
  }]
  localStorage.setItem('mainId', 1);
}
// localStorage.setItem('notes', JSON.stringify([{
//   id: 0,
//   title: 'Welcome to Notepad',
//   text: '5/29/2025'
// }, {
//   id: 1,
//   title: 'First Title',
//   text: 'Second Title'
// }, {
//   id: 2,
//   title: 'Second Title',
//   text: 'Second Title',
// }, {
//   id: 3,
//   title: 'Third Title',
//   text: 'Third Title',
// }, {
//   id: 4,
//   title: 'Fourth Title',
//   text: 'Fourth Text',
// }, {
//   id: 5,
//   title: 'Fifth Title',
//   text: 'Fifth Text',
// }]));
// localStorage.setItem('mainId', 6);
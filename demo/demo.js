import NoteBookComponent from '../main'; // to demo direct API usage
import {notes} from './notesDummy';

function mapNotes(notesList, lists, quantity) {
  notesList.map((item, i) => {
    const index = i % quantity;
    lists[index].cards.push(item);
  });
}

function init(quantity) {
  const lists = [];
  const notesList = [];
    // initialize lists
  for (let ic = 0; ic < quantity; ic++) {
    lists.push({
      id: ic,
      name: '',
      cards: []
    });
  }

//   notesList.push({
//     id: 0,
//     title: '',
//     cardFormat: 'add mode',
//     content: '',
//     content2: ''
//   });

  // const randomQuantity = Math.floor(Math.random() * (9 - 1 + 1)) + 1;
  // const randomQuantity = 20;
  for (let ic = 0; ic < notes.total; ic++) {
    const note = notes.rows[ic];
    note.cardFormat='note';
    note.title=note.quote;
    note.content=note.text;
    const timeStamp=note.updatedTimestamp?note.updatedTimestamp:note.createdTimestamp;
    note.changeDate=new Date(parseInt(timeStamp)).toDateString();
    if (note.colorCode === '#FFD232') { //Yellow
      note.noteText = 'Q'; //Questions
    } else if (note.colorCode === '#55DF49') { //Green
      note.noteText = 'M'; //Main Idea
    } else if (note.colorCode === '#FC92CF') { //Pink
      note.noteText = 'O'; //Observations
    } else if (note.colorCode === '#ccf5fd') { //Share(Blue)
      note.noteText = 'I'; // From Instructor
    }
    notesList.push(note);
  }

  mapNotes(notesList, lists, quantity);


  new NoteBookComponent({
    elementId: 'demo',
    locale: 'en-us',
    callback: (msg, data) => {
      console.log(msg, data);
    },
    lists:lists
  });
}

window.onload = init(5);

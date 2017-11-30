import NoteBookComponent from '../main'; // to demo direct API usage
import {notes} from './notesDummy';

function init() {
  const notesList = [];

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

  new NoteBookComponent({
    elementId: 'demo',
    locale: 'en-us',
    callback: (msg, data) => {
      console.log(msg, data);
    },
    notesList: notesList
  //  responsiveColumns
  });
}

window.onload = init();

import NoteBookComponent from '../main'; // to demo direct API usage
import {notes, tocData} from './notesDummy';

function init() {
  const notesList = [];

  for (let ic = 0; ic < notes.total; ic++) {
    const note = notes.response[ic].data;
    const groupNote = notes.response[ic].data;
    const group = notes.response[ic];
    note.cardFormat = 'note';
    if (group.tagId) {
      note.tagId = group.tagId;
      const index = _.findIndex(notesList, function (o) { return o.tagId === group.tagId; });
      note.groupedNotes = [];
      note.groupedNotes.push(groupNote);
    }


    if (notes.response[ic].pageId) {
      note.title = note.source.title;
      note.highLightText = note.quote;
      note.pageId = notes.response[ic].pageId;
    } else {
      note.title = note.quote;
    }
    note.content = note.text;
    note.tagId      = notes.response[ic].tagId;
    note.tagName    = notes.response[ic].tagName;
    note.insetSeq   = notes.response[ic].insetSeq;
    note.outsetSeq  = notes.response[ic].outsetSeq;
    note.notes      = notes.response[ic].notes;
    const timeStamp = note.updatedTimestamp ? note.updatedTimestamp : note.createdTimestamp;
    note.changeDate = timeStamp;
    if (note.colorCode === '#FFD232') { //Yellow
      note.noteText = 'Q'; //Questions
    } else if (note.colorCode === '#55DF49') { //Green
      note.noteText = 'M'; //Main Idea
    } else if (note.colorCode === '#FC92CF') { //Pink
      note.noteText = 'O'; //Observations
    } else if (note.colorCode === '#ccf5fd') { //Share(Blue)
      note.noteText = 'I'; // From Instructor
    } else if (note.colorCode === 'GROUP') { //Group Card (Blue)
      note.noteText = 'G'; // Group
    }
    notesList.push(note);
  }

  let toolbarModeProp = new toolbarMode();

  new NoteBookComponent({
    elementId: 'demo',
    locale: 'en-us',
    callback: (msg, data) => {
      console.log(msg, data);
    },
    notesList: notesList,
    tocData : tocData,
    toolbarMode: toolbarModeProp,
    handleGroupClick: (tagId, tagName) => {
      console.log('tagId: ', tagId);
    }
    //  responsiveColumns
  });
}

class toolbarMode {
  constructor() {
    this.groupMode = 'DEFAULT';
    this.groupTitle = null;
  }
}

window.onload = init();

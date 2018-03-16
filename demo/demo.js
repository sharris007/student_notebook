import NoteBookComponent from '../main'; // to demo direct API usage
import { notes, tocData } from './notesDummy';

function init() {
  const notesList = [];
  const originalNotesList = [];

  let groups = [];

  for (let ic = 0; ic < notes.total; ic++) {
    const note = notes.response[ic].data;
    note.cardFormat = 'note';
    if (notes.response[ic].pageId) {
      note.title = note.source.title;
      note.highLightText = note.quote;
      note.pageId = notes.response[ic].pageId;
    } else {
      note.title = note.quote;
    }
    note.content = note.text;
    note.tagId = notes.response[ic].tagId;
    note.tagName = notes.response[ic].tagName;
    note.insetSeq = notes.response[ic].insetSeq;
    note.outsetSeq = notes.response[ic].outsetSeq;
    const timeStamp = note.updatedTimestamp ? note.updatedTimestamp : note.createdTimestamp;
    note.changeDate = timeStamp;
    if (note.colorCode === '#ffedad') { //Yellow
      note.noteText = 'Q'; //Questions
    } else if (note.colorCode === '#bbf2b6') { //Green 
      note.noteText = 'M'; //Main Idea
    } else if (note.colorCode === '#fed3ec') { //Pink 
      note.noteText = 'O'; //Observations
    } else if (note.colorCode === '#ccf5fd') { //Share(Blue)
      note.noteText = 'I'; // From Instructor
    } else if (note.colorCode === 'GROUP') { //Group Card (Blue)
   //   note.noteText = 'G'; // Group
    }

    let dupNote = _.cloneDeep(note);

    originalNotesList.push(dupNote);


    if (notes.response[ic].tagId) {
      const index = _.findIndex(groups, function (o) { return o.tagId === notes.response[ic].tagId; });
      if (index === -1) {
        note.notes = [];
        note.notes.push(note);
        groups.push(note);
      } else {
        note.tagId = null;
        note.tagName = null;
        groups[index].notes.push(note)
      }
    } else {
      notesList.push(note);
    }
  }
  // }
// add group to beginning of notes list
  groups.map((group, i) => {
    notesList.unshift(group);
  });


;
  let toolbarModeProp = new toolbarMode();
  new NoteBookComponent({
    elementId: 'demo',
    locale: 'en-us',
    callback: (msg, data) => {
      console.log(msg, data);
    },
    notesList: notesList,
    originalNotesList: originalNotesList,
    tocData: tocData,
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
    this.groupId = null;
  }
}

window.onload = init();

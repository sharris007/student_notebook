import NoteBookComponent from '../main'; // to demo direct API usage
import { notes, tocData } from './notesDummy';

function init() {
  const notesList = [];

  let groups = [];

  for (let ic = 0; ic < notes.total; ic++) {
    const note = notes.response[ic].data;

    //   const groupNote = notes.response[ic].data;
    //  const group = notes.response[ic];
    note.cardFormat = 'note';
    // if (notes.response[ic].tagId) {
    //   note.tagId = notes.response[ic].tagId;
    //   note.tagName = notes.response[ic].tagName;
    //   const index = _.findIndex(groups, function (o) { return o.tagId === notes.response[ic].tagId; });
    //   if (index === -1) {
    //     note.notes = [];
    //     groups.push(note);
    //   } else {
    //     debugger;
    //     groups[index].notes.push(note)
    //   }
    // } else {


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
    //  note.notes = notes.response[ic].notes;
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


    if (notes.response[ic].tagId) {
      //  note.tagId = notes.response[ic].tagId;
      //  note.tagName = notes.response[ic].tagName;

      const index = _.findIndex(groups, function (o) { return o.tagId === notes.response[ic].tagId; });
      if (index === -1) {
        note.notes = [];
        note.notes.push(note);
        note.noteText = 'G'; // Group
        groups.push(note);
      } else {
        groups[index].notes.push(note)
      }
    } else {
      notesList.push(note);
    }
  }

  // }

  groups.map((group, i) => {
    notesList.splice(0, 1, group);

  });

  debugger;


  let toolbarModeProp = new toolbarMode();

  new NoteBookComponent({
    elementId: 'demo',
    locale: 'en-us',
    callback: (msg, data) => {
      console.log(msg, data);
    },
    notesList: notesList,
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
  }
}

window.onload = init();

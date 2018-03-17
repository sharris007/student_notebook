import NoteBookComponent from '../main'; // to demo direct API usage
import { tocData} from './notesDummy';

function init() {
  const getAllNotes = fetch('https://spectrum-qa.pearsoned.com/api/v1/context/5a9f8a6ce4b0576972d62596/identities/ffffffff57a9f814e4b00d0a20bf6029/notesX?pageId=ac2548718ca9f4783409d6b0f2786e86c57387500-e0d1331d346b484a8556f8d810dbdc2c', {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Authorization' : 'eyJraWQiOiJrMTYzMzQ3Mzg2MCIsImFsZyI6IlJTNTEyIn0.eyJoY2MiOiJVUyIsInN1YiI6ImZmZmZmZmZmNTdhOWY4MTRlNGIwMGQwYTIwYmY2MDI5IiwidHlwZSI6ImF0IiwiZXhwIjoxNTIxMjgxODAwLCJpYXQiOjE1MjEyNzA5OTksInNlc3NpZCI6IjY3OTM4Y2UzLTA5MWItNDc5NC05NDk0LTM4N2ExYjMzNDg2YSJ9.NETvNaIUNorN0757ColhbDK9YX7_WVCIOggGgp6kRXAsMfzNUJznvZD-_uzrJASsjEeijG8JYeGe3KiLZM9BPoES6DOXW7uZ1A_ZRTfW8fUE49JFPFWi7iFIbdlF9Mkkskr3HkC8EjRs8bkMa41tv6Iceh1g_fYuQHtZf_KxVOg'
  }
  }).then((res) => res.json()).then((json) => 
  { 
   console.log("res", json);
   const notes = json;
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
        const getContextLen = notes.response[ic].contextualInfo.length;
        for (let i = 0; i < getContextLen; i++) {
          note.title = notes.response[ic].contextualInfo[i].value;
        }
        
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

  });

  

  
}

class toolbarMode {
  constructor() {
    this.groupMode = 'DEFAULT';
    this.groupTitle = null;
  }
}

window.onload = init();

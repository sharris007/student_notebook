import NoteBookComponent from '../main'; // to demo direct API usage
import { tocData} from './notesDummy';
import _ from 'lodash';

function init() {
  const getAllNotes = fetch('https://spectrum-qa.pearsoned.com/api/v1/context/5a9f8a6ce4b0576972d62596/identities/ffffffff57a9f814e4b00d0a20bf6029/notesX?pageId=ac2548718ca9f4783409d6b0f2786e86c57387500-e0d1331d346b484a8556f8d810dbdc2c', {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Authorization' : 'eyJraWQiOiJrMTYzMzQ3Mzg2MCIsImFsZyI6IlJTNTEyIn0.eyJoY2MiOiJVUyIsInN1YiI6ImZmZmZmZmZmNTdhOWY4MTRlNGIwMGQwYTIwYmY2MDI5IiwidHlwZSI6ImF0IiwiZXhwIjoxNTIxMjkyMTE1LCJpYXQiOjE1MjEyODEzMTQsInNlc3NpZCI6IjI0NGVmMThmLTM3ZWEtNGUyZC05ZjBkLTFjOTc4MWQzMjAyMCJ9.KtZPiCCMyou9OCguAj4kkAmvAQ8LNlIZdTEZ_1N8gnCP4FKsNXykxY5f-y-VB8zUR8GubTVuaJ0-Jl1zbE2cxsBWCbD1IE3N2VIcSGG9_rdoN3udLIl-GHIZLKKjcnLO3z8xVuJrOoVfh1V5tWYGTSu5G27s-qd0ymBve8iSYfE'
  }
  }).then((res) => res.json()).then((json) => 
  { 
   console.log("res", json);
   const notes = json;
   const notesList = [];

    for (let ic = 0; ic < notes.total; ic++) {
      const noteObj = notes.response[ic];
      const note = noteObj.data;
      const groupNote = noteObj.data;
      note.cardFormat = 'note';
      const contextualInfo = noteObj.contextualInfo; 
      if (noteObj.tagId) {
        note.tagId = noteObj.tagId;
        const index = _.findIndex(notesList, function (o) { return o.tagId === noteObj.tagId; });
        note.groupedNotes = [];
        note.groupedNotes.push(groupNote);
      }

      if (noteObj.pageId) {
          let titleIndex = _.findIndex(contextualInfo, function(obj) { return obj.key === 'title'; });
          note.title = contextualInfo[titleIndex].value;
          note.highLightText = note.quote;
          note.pageId = noteObj.pageId;
      } else {
        note.title = note.quote;
      }
      note.content = note.text;
      note.tagId      = noteObj.tagId;
      note.tagName    = noteObj.tagName;
      note.insetSeq   = noteObj.insetSeq;
      note.outsetSeq  = noteObj.outsetSeq;
      note.notes      = noteObj.notes;
      note.timeStamp = noteObj.updatedTime ? noteObj.updatedTime : noteObj.createdTime;
      note.noteType = noteObj.noteType;
      note.id = noteObj.id;
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

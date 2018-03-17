import NoteBookComponent from '../main'; // to demo direct API usage
import { notes } from './notesDummy';
import _ from 'lodash';

function init() {
  const notesList = [];
  const originalNotesList = [];

  let groups = [];
  let tocData;
  const getAllNotes = fetch('https://spectrum-qa.pearsoned.com/api/v1/context/5a9f8a6ce4b0576972d62596/identities/ffffffff57a9f814e4b00d0a20bf6029/notesX?pageId=ac2548718ca9f4783409d6b0f2786e86c57387500-e0d1331d346b484a8556f8d810dbdc2c', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Authorization': 'eyJraWQiOiJrMTYzMzQ3Mzg2MCIsImFsZyI6IlJTNTEyIn0.eyJoY2MiOiJVUyIsInN1YiI6ImZmZmZmZmZmNTdhOWY4MTRlNGIwMGQwYTIwYmY2MDI5IiwidHlwZSI6ImF0IiwiZXhwIjoxNTIxMjk3NDQ2LCJpYXQiOjE1MjEyODY2NDYsInNlc3NpZCI6ImZkMzQ2MTViLWQ0ODUtNDk4Zi05MmFjLTBhODc1MTA5OWMyMiJ9.VWtky2dcXqBv_73I8OWWD-hZVS6CkOLkgkdvZn9Zxb90wbe8Cwp4Q_4pucUeboFQFjThhn344ikNhGZutJD5WmKNWk3OtBKM4ahadr8hyvzuwHCppFIixSZKtwEdWtUqLPHr8wRMfNDd8Cv2_F8B9JUQlCis1ma6Fj2hsNuRXcM'
    }
  }).then((res) => res.json()).then((json) => {
    const notes = json;
    for (let ic = 0; ic < notes.total; ic++) {
       const noteObj = notes.response[ic];
      const note = noteObj.data;
      const groupNote = noteObj.data;
      note.cardFormat = 'note';
      const contextualInfo = noteObj.contextualInfo; 
      if (noteObj.pageId) {
          let titleIndex = _.findIndex(contextualInfo, function(obj) { return obj.key === 'title'; });
          note.title = contextualInfo[titleIndex].value;
          note.highLightText = note.quote;
          note.pageId = noteObj.pageId;
      } 
      else {
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

      let dupNote = _.cloneDeep(note);

      originalNotesList.push(dupNote);


      if (noteObj.tagId) {
        const index = _.findIndex(groups, function (o) { return o.tagId === noteObj.tagId; });
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

    let toolbarModeProp = new toolbarMode();
    fetch('https://etext-qa-stg.pearson.com/api/nextext-api/v1/api/nextext/custom/toc/contextId/5a9f8a6ce4b0576972d62596?provider=https://content.stg-openclass.com/eps/pearson-reader/api/item/591fb53c-a53a-47d8-b32e-f2b850403061/1/file/nay4_5-25a_post/OPS/toc.xhtml', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Authorization': 'eyJraWQiOiJrMTYzMzQ3Mzg2MCIsImFsZyI6IlJTNTEyIn0.eyJoY2MiOiJVUyIsInN1YiI6ImZmZmZmZmZmNTdhOWY4MTRlNGIwMGQwYTIwYmY2MDI5IiwidHlwZSI6ImF0IiwiZXhwIjoxNTIxMjk3NDQ2LCJpYXQiOjE1MjEyODY2NDYsInNlc3NpZCI6ImZkMzQ2MTViLWQ0ODUtNDk4Zi05MmFjLTBhODc1MTA5OWMyMiJ9.VWtky2dcXqBv_73I8OWWD-hZVS6CkOLkgkdvZn9Zxb90wbe8Cwp4Q_4pucUeboFQFjThhn344ikNhGZutJD5WmKNWk3OtBKM4ahadr8hyvzuwHCppFIixSZKtwEdWtUqLPHr8wRMfNDd8Cv2_F8B9JUQlCis1ma6Fj2hsNuRXcM'
      }
    }).then((res) => res.json()).then((json) => {
      tocData = json.content;
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

    });
    
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

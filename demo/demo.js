import NoteBookComponent from '../main'; // to demo direct API usage
import { notes, tocData } from './notesDummy';
import _ from 'lodash';

function init() {
  const notesList = [];
  const originalNotesList = [];

  let groups = [];
  const getAllNotes = fetch('https://spectrum-qa.pearsoned.com/api/v1/context/5a9f8a6ce4b0576972d62596/identities/ffffffff57a9f814e4b00d0a20bf6029/notesX?pageId=ac2548718ca9f4783409d6b0f2786e86c57387500-e0d1331d346b484a8556f8d810dbdc2c', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Authorization': 'eyJraWQiOiJrMTYzMzQ3Mzg2MCIsImFsZyI6IlJTNTEyIn0.eyJzdWIiOiJmZmZmZmZmZjU3YTlmODE0ZTRiMDBkMGEyMGJmNjAyOSIsImhjYyI6IlVTIiwidHlwZSI6ImF0IiwiZXhwIjoxNTIxMjg1NjI0LCJpYXQiOjE1MjEyODM4MjMsImNsaWVudF9pZCI6IkkyUkpkN2VPNUY5VDZVOVRnVks3Vnh0QWd3NDh1MHBVIiwic2Vzc2lkIjoiN2E1N2Y3OTItMGFmNS00NDBmLWFlYWItYzdlNGIwZWU3NjVmIn0.PIBCXvhvtTV2VEynxnFuUY4y5o83m_0_wG1DAANepbAo6PoZ5FG37OK8GgHquc8tD3K8ncveS4xd_XVRmGnqRzJHcVMaNV2FtiGLns5nb3znM-KQwbAUAEsfJ9yLwdxJmQLW1PUEVnk3SCC-hdRu0_kpvCrXhJJXOBa26Na5G1Y'
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
}

class toolbarMode {
  constructor() {
    this.groupMode = 'DEFAULT';
    this.groupTitle = null;
    this.groupId = null;
  }
}

window.onload = init();

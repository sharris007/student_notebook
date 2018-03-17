import NoteBookComponent from '../main'; // to demo direct API usage
import { notes, tocData } from './notesDummy';

function init() {
  const notesList = [];
  const originalNotesList = [];

  let groups = [];
  const getAllNotes = fetch('https://spectrum-qa.pearsoned.com/api/v1/context/5a9f8a6ce4b0576972d62596/identities/ffffffff57a9f814e4b00d0a20bf6029/notesX?pageId=ac2548718ca9f4783409d6b0f2786e86c57387500-e0d1331d346b484a8556f8d810dbdc2c', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Authorization': 'eyJraWQiOiJrMTYzMzQ3Mzg2MCIsImFsZyI6IlJTNTEyIn0.eyJzdWIiOiJmZmZmZmZmZjU3YTlmODE0ZTRiMDBkMGEyMGJmNjAyOSIsImhjYyI6IlVTIiwidHlwZSI6ImF0IiwiZXhwIjoxNTIxMjgyOTIxLCJpYXQiOjE1MjEyODExMjEsImNsaWVudF9pZCI6IkkyUkpkN2VPNUY5VDZVOVRnVks3Vnh0QWd3NDh1MHBVIiwic2Vzc2lkIjoiN2E1N2Y3OTItMGFmNS00NDBmLWFlYWItYzdlNGIwZWU3NjVmIn0.ZsIOPZt9Wz2WGVD24uZh2v4uOas_ux0BWMyuNaMjyv7OGmTdGOVtI_XJgKfJsqUshKSTM9-yvoDsAGV-8TrcRxgnnhZ_5rkSP9ncClx7vhJNfkHFMvQZ-A8TUElzXN1PYcJujvLMfQ6O0_JDpfrOLTb6TrdcYj55OatG1dcPhR8'
    }
  }).then((res) => res.json()).then((json) => {
    const notes = json;
    for (let ic = 0; ic < notes.total; ic++) {
      const note = notes.response[ic].data;
      note.cardFormat = 'note';
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

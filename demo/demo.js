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
      'X-Authorization': 'eyJraWQiOiJrMTYzMzQ3Mzg2MCIsImFsZyI6IlJTNTEyIn0.eyJzdWIiOiJmZmZmZmZmZjU5Y2JjMDRiZTRiMDllZmIzNDQwNWU1MiIsImhjYyI6IlVTIiwidHlwZSI6ImF0IiwiZXhwIjoxNTIxMzkyNTc1LCJpYXQiOjE1MjEzOTA3NzQsImNsaWVudF9pZCI6IkkyUkpkN2VPNUY5VDZVOVRnVks3Vnh0QWd3NDh1MHBVIiwic2Vzc2lkIjoiZmJiMGE5ZGItMTNmZS00YTQ0LWE3NGEtZjA0YjczODdmNmQyIn0.Mxdq-sfnaIBajQaiWoG5a19E2BFt0ZrRCdwoEf_WSdmsv0CSp1FoSSRDkHvzVO-FL8R0_jpzMAqDKTao1f0-wgF5BcKwXIVVS2gspmv_Vl31B0YcgSkWNgr7rOQZ4n8pE9alO9ToxLrUA-BsK-ZV5-Rskep8dN8eZppMzHKzwwI'
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
      note.tags      = noteObj.tags;
      note.notes     = noteObj.notes;
      note.timeStamp = noteObj.updatedTime ? noteObj.updatedTime : noteObj.createdTime;
      note.noteType  = noteObj.noteType;
      note.id        = noteObj.id;

      let dupNote = _.cloneDeep(note);

      originalNotesList.push(dupNote);


      if (noteObj.tags) {
        const index = _.findIndex(groups, function (o) {
            return o.tags[0].tagId === noteObj.tags[0].tagId; 
        });
        if (index === -1) {
          note.notes = [];
          note.notes.push(note);
          groups.push(note);
        } else {
            note.tagId = null;
            note.tagName = null;
            groups[index].notes.push(note);
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
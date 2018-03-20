import NoteBookComponent from '../main'; // to demo direct API usage
// import { notes } from './notesDummy';
import _ from 'lodash';

const piToken = 'eyJraWQiOiJrMTYzMzQ3Mzg2MCIsImFsZyI6IlJTNTEyIn0.eyJvY2QiOiIxNTIxNTI3NjQ4Iiwic3ViIjoiZmZmZmZmZmY1N2E5ZjgxNGU0YjAwZDBhMjBiZjYwMjkiLCJiaCI6Ii02NDc0MTA2MzIiLCJoY2MiOiJVUyIsInR5cGUiOiJzZSIsImV4cCI6MTUyMTU0NTY0OSwiaWF0IjoxNTIxNTI3NjQ4LCJjbGllbnRfaWQiOiJJMlJKZDdlTzVGOVQ2VTlUZ1ZLN1Z4dEFndzQ4dTBwVSIsInNlc3NpZCI6ImU1NTI1ODA1LWI2YjgtNDljNC05ODI2LWQzZWY0NzM4MmViMCJ9.GLVDlhOOrh5kOubo40zNEcTwbRdXaalI1AdwXaAje4CT6ruTQ6r9M6Q0qYAWRMxbqnZj3YtdPZu43E2uIkRXAyEOrBvn0lAPMw678l1FY8zRiXzXgB9bwcqImxDx6cOFA6Y96jgDXgleTK4aYTa1hgxl2L7U7uxkIicg7kFGs08';
function init() {

  const notesList = [];
  const originalNotesList = [];

  const groups = [];
  let tocData;
  const getAllNotes = fetch('https://spectrum-qa.pearsoned.com/api/v1/context/5a9f8a6ce4b0576972d62596/identities/ffffffff57a9f814e4b00d0a20bf6029/notesX', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Authorization': piToken
    }
  }).then((res) => res.json()).then((json) => {
    const notes = json;
    for (let ic = 0; ic < notes.total; ic++) {
      const noteObj = notes.response[ic];
      const note = noteObj.data;
      // const groupNote = noteObj.data;
      note.cardFormat = 'note';
      const contextualInfo = noteObj.contextualInfo;
      if (noteObj.pageId) {
        const titleIndex = _.findIndex(contextualInfo, function (obj) { return obj.key === 'title'; });
        note.title = contextualInfo ? contextualInfo[titleIndex].value : null;
        note.highLightText = note.quote;
        note.pageId = noteObj.pageId;
      }
      else {
        note.title = note.quote;
      }
      note.content = note.text;
      note.tags = noteObj.tags;
      note.notes = noteObj.notes;
      note.timeStamp = noteObj.updatedTime ? noteObj.updatedTime : noteObj.createdTime;
      note.noteType = noteObj.noteType;
      note.id = noteObj.id;

      const dupNote = _.cloneDeep(note);

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

    const toolbarModeProp = new toolbarMode();
    fetch('https://etext-qa-stg.pearson.com/api/nextext-api/v1/api/nextext/custom/toc/contextId/5a9f8a6ce4b0576972d62596?provider=https://content.stg-openclass.com/eps/pearson-reader/api/item/591fb53c-a53a-47d8-b32e-f2b850403061/1/file/nay4_5-25a_post/OPS/toc.xhtml', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Authorization': piToken
      }
    }).then((res) => res.json()).then((json) => {
      tocData = json.content;
      new NoteBookComponent({
        elementId: 'demo',
        locale: 'en-us',
        callback: callback,
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
};
function callback(msg, data) {
  if (data) {
    if (msg === 'ADD') {
      addNote(msg, data);
    }
    else if (msg === 'DELETE') {
      deleteNote(msg, data);
    }
  }
};
function addNote(msg, data) {
  const payLoad = {
    'payload': [
      {
        "clientApp": 'ETEXT2_WEB',
        "productModel": "ETEXT_SMS",
        "contextualInfo": [
          {
            "key": "title",
            "value": "asjln192882salnsal-saaksm-qsq2"
          }
        ],
        "pageId": null,
        "noteType": "CUSTOM_NOTE",
        "shareable": false,
        "tags": [],
        "data": {
          "quote": data.title ? data.title : '',
          "text": data.content ? data.content : ''
        }
      }
    ]
  };
  const addCustomNote = fetch('https://spectrum-qa.pearsoned.com/api/v1/context/5a9f8a6ce4b0576972d62596/identities/ffffffff57a9f814e4b00d0a20bf6029/notesX', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Authorization': piToken
    },
    body: JSON.stringify(payLoad)
  }).then((res) => res.json()).then((json) => {
    console.log('Custom Note successfully created!');
  });
};
function deleteNote(msg, data) {
  const payLoad = { ids: [data.id] };
  const deleteCustomNote = fetch('https://spectrum-qa.pearsoned.com/api/v1/context/5a9f8a6ce4b0576972d62596/identities/ffffffff57a9f814e4b00d0a20bf6029/notesX', {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Authorization': piToken
    },
    body: JSON.stringify(payLoad)
  }).then((res) => res.json()).then((json) => {
    console.log('Custom Note successfully deleted!');
  });
};
class toolbarMode {
  constructor() {
    this.groupMode = 'DEFAULT';
    this.groupTitle = null;
    this.groupId = null;
  }
}

window.onload = init();
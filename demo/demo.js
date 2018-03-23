import NoteBookComponent from '../main'; // to demo direct API usage
// import { notes } from './notesDummy';
import _ from 'lodash';

const piToken = 'eyJraWQiOiJrMTYzMzQ3Mzg2MCIsImFsZyI6IlJTNTEyIn0.eyJvY2QiOiIxNTIxNzg1NzEyIiwic3ViIjoiZmZmZmZmZmY1N2E5ZjgxNGU0YjAwZDBhMjBiZjYwMjkiLCJiaCI6Ii02NDc0MTA2MzIiLCJoY2MiOiJVUyIsInR5cGUiOiJzZSIsImV4cCI6MTUyMTgwNjQxNSwiaWF0IjoxNTIxNzg4NDE1LCJjbGllbnRfaWQiOiJJMlJKZDdlTzVGOVQ2VTlUZ1ZLN1Z4dEFndzQ4dTBwVSIsInNlc3NpZCI6ImI2MmI5OWEyLWJkZTYtNDBmNC04YmM5LTI1OTU0Yjc2MjAwMCJ9.hzDE2R8zQqn5n5YRtA2rYH3Si8XLcrQoxOh5U35nwI00fe6KzEisbOGDHN-LAxzpAshMWVjwtjOMCw3DvzzYLIqvK5DANHxBjFd9JKRtZWGocchlLGKdonCfg6GSckCjtc5lKA_2c0zp8y7sfbwf2-bVxQQWc3luJM8ruNW2Vxs';
function init() {
  getNotes();
};
function callback(msg, data) {
  if (data) {
    if (msg === 'ADD') {
      addNote(msg, data);
    }
    else if (msg === 'SAVE') {
      saveNote(msg, data);
    }
    else if (msg === 'DELETE') {
      deleteNote(msg, data);
    }
    else if (msg === "GROUP") {
    }
     else if (msg === "EDITGROUP") {
    }
    else if (msg === "UNGROUP NOTES") {
      ungroupNotes(msg, data);
    }
  }
};
function getNotes() {
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
        note.title = contextualInfo && titleIndex !== -1 ? contextualInfo[titleIndex].value : null;
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
      note.outsetSeq = noteObj.outsetSeq;

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
    const toolbarModeProp = new toolbarMode();
    if (groups.length > 0) {
      const getAllTagName = fetch('https://spectrum-qa.pearsoned.com/api/v1/context/5a9f8a6ce4b0576972d62596/identities/ffffffff57a9f814e4b00d0a20bf6029/notesX/contextLog', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Authorization': piToken
        }
      }).then((res) => res.json()).then((json) => {
        const tagObject = json.tagAttributes;

        tagObject.map((tag, i) => {
          _.each(groups, function (obj, index) {
            if (groups[index].tags[0].tagId === tag.tagId) {
              groups[index].tags[0].tagName = tag.tagName;
            }
          });
        });



        groups.map((group, i) => {
          notesList.unshift(group);
        });

         toolbarModeProp.groups = groups;

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
            tagAttributes: tagObject,
            toolbarMode: toolbarModeProp,
            handleGroupClick: (tagId, tagName) => {
            }
            //  responsiveColumns
          });

        });
      });
    } else {
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
          tagAttributes: [],
          toolbarMode: toolbarModeProp,
          handleGroupClick: (tagId, tagName) => {
          }
          //  responsiveColumns
        });

      });
    }
  });
}

function addNote(msg, data) {
  const payLoad = {
    'payload': [
      {
        "clientApp": 'ETEXT2_WEB',
        "productModel": "ETEXT_SMS",
        "contextualInfo": [
          {
            "key": "",
            "value": ""
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
    getNotes();
    console.log('Custom Note successfully created!');
    return json;
  });
};
function saveNote(msg, data) {
  const payLoad = {
    "clientApp": 'ETEXT2_WEB',
    "productModel": "ETEXT_SMS",
    "contextualInfo": [
      {
        "key": "",
        "value": ""
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
  };
  const saveNotes = fetch('https://spectrum-qa.pearsoned.com/api/v1/context/5a9f8a6ce4b0576972d62596/identities/ffffffff57a9f814e4b00d0a20bf6029/notesX/' + data.id, {
    method: 'PUT',
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
    getNotes();
    console.log('Custom Note successfully deleted!');
  });
};
function ungroupNotes(msg, data) {
  let tagId = null;
  let tagName = null;
  data.tags.map((tag, i) => {
    tagId = tag.tagId;
    tagName = tag.tagName;
  });
  const payLoad = {
    "tagName": tagName,
    "notes": []
  };
  const deleteCustomNote = fetch('https://spectrum-qa.pearsoned.com/api/v1/context/5a9f8a6ce4b0576972d62596/identities/ffffffff57a9f814e4b00d0a20bf6029/notesX/tag/' + tagId, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Authorization': piToken
    },
    body: JSON.stringify(payLoad)
  }).then((res) => res.json()).then((json) => {
    console.log('Notes successfully ungrouped!');
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
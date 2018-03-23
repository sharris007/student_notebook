import NoteBookComponent from '../main'; // to demo direct API usage
// import { notes } from './notesDummy';
import _ from 'lodash';

const piToken = 'eyJraWQiOiJrMTYzMzQ3Mzg2MCIsImFsZyI6IlJTNTEyIn0.eyJzdWIiOiJmZmZmZmZmZjU3YTlmODE0ZTRiMDBkMGEyMGJmNjAyOSIsImhjYyI6IlVTIiwidHlwZSI6ImF0IiwiZXhwIjoxNTIxNzgzNjgwLCJpYXQiOjE1MjE3ODE4NzksImNsaWVudF9pZCI6IktDcGpuYnFBTkIwUmtJOGFvaHo1dVJCTUFHZU41RkdBIiwic2Vzc2lkIjoiMjU4YTE1MTgtOGIxNC00YjQ5LWFhZjUtNjQxNmI0NzI5NzBkIn0.Tupt1OBrEmtUmmcZ6LjKdI0C_JmsZgihO3ds-QBnaBfBHa9HGAdSnKiGZNS76UoZZPMWCADtfbqE9IgHy621cMytgWKrslJ1gVYgIitXqGyw8Lddr01BSxcMnar5658OmcemmgtGrRc8U6OkIODiGNbdkeRkjMNjukLs7ZEkR9o';
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
    console.log(notes);
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
      if (ic === 1) { note.noteType = 'OBSERVATIONS'; }
      if (ic === 2) { note.noteType = 'OBSERVATIONS'; }
      if (ic === 3) { note.noteType = 'OBSERVATIONS'; }
      if (ic === 4) { note.noteType = 'QUESTIONS'; }
      if (ic === 5) { note.noteType = 'FROM_INSTRUCTOR'; }
      if (ic === 6) { note.noteType = 'MAIN_IDEAS'; }
      if (ic === 8) { note.noteType = 'FROM_INSTRUCTOR'; }
      if (ic === 9) { note.noteType = 'FROM_INSTRUCTOR'; }
      if (ic === 10) { note.noteType = 'QUESTIONS'; }
      if (ic === 11) { note.noteType = 'QUESTIONS'; }
      
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

        // QUICK FIX

        debugger;
        _.each(groups, function (group, i) {
          const index = _.findIndex(tagObject, function (o) { return o.tagId === group.tags[0].tagId; });
          if (index === -1) {
            tagObject.push({ tagId: group.tags[0].tagId, tagName: 'Group ' + i });
          }
        });



        console.log(tagObject);

        debugger;
        tagObject.map((tag, i) => {
          _.each(groups, function (obj, index) {
            if (groups[index].tags[0].tagId === tag.tagId) {
              groups[index].tags[0].tagName = tag.tagName;
            }
          });
        });



        groups.map((group, i) => {
          if (!!!group.tags[0].tagName) {
            group.tags[0].tagName = 'Group ' + i;
          }
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
              console.log('tagId: ', tagId);
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
            console.log('tagId: ', tagId);
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
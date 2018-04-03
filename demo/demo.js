import NoteBookComponent from '../main'; // to demo direct API usage
// import { notes } from './notesDummy';
import _ from 'lodash';

const piToken = 'eyJraWQiOiJrMjAyOTE3MzM4IiwiYWxnIjoiUlM1MTIifQ.eyJoY2MiOiJVUyIsInN1YiI6ImZmZmZmZmZmNTdhOWY4MTRlNGIwMGQwYTIwYmY2MDI5IiwidHlwZSI6ImF0IiwiZXhwIjoxNTIyNzUzOTM0LCJpYXQiOjE1MjI3NDMxMzQsInNlc3NpZCI6ImU4ZTRjZDdmLTMyMWEtNDUwMy05ZGRhLTM2YTM3MDhmYjYzNyJ9.C8LIByWxDQNo3mBolfzs__5tXlYeixo0yazrPuhXrX-qvVYerjep988DHMNtE0bGC5RcWPKZVlviERdr1aN77kQscDyAGhXnMChaiYQwS72oMhNDE_oUS1z4j-7aWZ1PlnMTYf-f04v8FFpTz5bZAXx5FXifYbhGrq2HxNyfIT4';
// localStorage.secureToken;

const contextId = '5a855d06e4b05b48d72dedb9' ;
const identityId = 'ffffffff5a0fbf14e4b0b67fcf25d616';
const provider ='https://content.stg-openclass.com/eps/pearson-reader/api/item/178634d3-b562-47cd-a38c-72c6c6713eaa/1/file/appling_jh1_09-14-15/OPS/toc.xhtml';

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
    else if (msg === 'GROUP') {
    }
     else if (msg === 'EDITGROUP') {
     }
    else if (msg === 'UNGROUP NOTES') {
      ungroupNotes(msg, data);
    }
  }
};
function getNotes() {
  const notesList = [];
  const originalNotesList = [];

  const groups = [];
  let tocData;
  const getAllNotes = fetch(`https://spectrum-qa.pearsoned.com/api/v1/context/${contextId}/identities/${identityId}/notesX`, {
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
      notesList.push(note);
    }
    const mapGroupEle = _.groupBy(notesList, function(i) {
      if (i.tags) { 
        return i.tags[0].tagId; 
      }
      else  {  return i.id;}});
    const getOrderedArr = _.sortBy(mapGroupEle, function(i) {return i[0].outsetSeq * -1;});
    const mapNotesObj = [];
    let groupFalg;
    _.forEach(getOrderedArr, function(value, index) {
      if (value.length=== 1) { 
        mapNotesObj.push(value[0]); 
      } 
      else { 
        value[0].notes = [];
        _.each(value, function (obj, index) {
          
          value[0].notes.push(value[index]);
        });
        mapNotesObj.push(value[0]); 
        groupFalg = true;
      }
    });
    console.log(mapNotesObj);
    // }
    // add group to beginning of notes list
    const toolbarModeProp = new toolbarMode();
    // if (!groupFalg) {
      const getAllTagName = fetch(`https://spectrum-qa.pearsoned.com/api/v1/context/${contextId}/identities/${identityId}/notesX/contextLog`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Authorization': piToken
        }
      }).then((res) => res.json()).then((json) => {
        const tagObject = (json.tagAttributes.length > 0) ? json.tagAttributes : [];
        const lastUsedFilters = json.lastUsedFilters
        tagObject.map((tag, i) => {
          _.each(mapNotesObj, function (obj, index) {
            if (obj.notes) {
              if (obj.tags[0].tagId === tag.tagId) {
                obj.tags[0].tagName = tag.tagName;
              }
            }
            
          });
        });

        toolbarModeProp.groups = groups;

        fetch(`https://etext-qa-stg.pearson.com/api/nextext-api/v1/api/nextext/custom/toc/contextId/${contextId}?provider=${provider}`, {
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
            notesList: mapNotesObj,
            originalNotesList: originalNotesList,
            tocData: tocData,
            tagAttributes: tagObject,
            lastUsedFilters : lastUsedFilters,
            toolbarMode: toolbarModeProp,
            handleGroupClick: (tagId, tagName) => {
            }
            //  responsiveColumns
          });

        });
      });
    // } else {
    //   fetch(`https://etext-qa-stg.pearson.com/api/nextext-api/v1/api/nextext/custom/toc/contextId/${contextId}?provider=${provider}`, {
    //     method: 'GET',
    //     headers: {
    //       'Accept': 'application/json',
    //       'Content-Type': 'application/json',
    //       'X-Authorization': piToken
    //     }
    //   }).then((res) => res.json()).then((json) => {
    //     tocData = json.content;
    //     new NoteBookComponent({
    //       elementId: 'demo',
    //       locale: 'en-us',
    //       callback: callback,
    //       notesList: mapNotesObj,
    //       originalNotesList: originalNotesList,
    //       tocData: tocData,
    //       tagAttributes: [],
    //       toolbarMode: toolbarModeProp,
    //       handleGroupClick: (tagId, tagName) => {
    //       }
    //       //  responsiveColumns
    //     });

    //   });
    // }
  });
}

function addNote(msg, data) {
  const payLoad = {
    'payload': [
      {
        'clientApp': 'ETEXT2_WEB',
        'productModel': 'ETEXT_SMS',
        'contextualInfo': [
          {
            'key': '',
            'value': ''
          }
        ],
        'pageId': null,
        'noteType': 'CUSTOM_NOTE',
        'shareable': false,
        'tags': [],
        'data': {
          'quote': data.title ? data.title : '',
          'text': data.content ? data.content : ''
        }
      }
    ]
  };
  const addCustomNote = fetch(`https://spectrum-qa.pearsoned.com/api/v1/context/${contextId}/identities/${identityId}/notesX`, {
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
  let payLoad = {
    'clientApp': 'ETEXT2_WEB',
    'productModel': 'ETEXT_SMS',
    'contextualInfo': [
      {
        'key': '',
        'value': ''
      }
    ],
    'pageId': null,
    'noteType': 'CUSTOM_NOTE',
    'shareable': false,
    'tags': [],
    'data': {
      'quote': data.title ? data.title : '',
      'text': data.content ? data.content : ''
    }
  };
  if (data.noteType && data.noteType !== 'CUSTOM_NOTE') {
    payLoad = {
      'clientApp': 'ETEXT2_WEB',
      'productModel': 'ETEXT_SMS',
      'contextualInfo': [
        {
          'key': 'title',
          'value': data.title ? data.title : '',
        }
      ],
      'pageId': data.pageId ? data.pageId : '',
      'noteType': data.noteType ? data.noteType : '',
      'shareable': false,
      'tags': data.tags ? data.tags : [],
      'data': {
        'quote': data.highLightText ? data.highLightText : '',
        'text': data.content ? data.content : ''
      }
    };
  }
  const saveNotes = fetch(`https://spectrum-qa.pearsoned.com/api/v1/context/${contextId}/identities/${identityId}/notesX/` + data.id, {
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
  const deleteCustomNote = fetch(`https://spectrum-qa.pearsoned.com/api/v1/context/${contextId}/identities/${identityId}/notesX`, {
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
function ungroupNotes(msg, data) {
  let tagId = null;
  let tagName = null;
  data.tags.map((tag, i) => {
    tagId = tag.tagId;
    tagName = tag.tagName;
  });
  const payLoad = {
    'tagName': tagName,
    'notes': []
  };
  const deleteCustomNote = fetch(`https://spectrum-qa.pearsoned.com/api/v1/context/${contextId}/identities/${identityId}/notesX/tag/` + tagId, {
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


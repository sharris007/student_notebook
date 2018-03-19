import NoteBookComponent from '../main'; // to demo direct API usage
import { notes } from './notesDummy';
import _ from 'lodash';

let piToken = 'eyJraWQiOiJrMTYzMzQ3Mzg2MCIsImFsZyI6IlJTNTEyIn0.eyJvY2QiOiIxNTIxNDUyODkxIiwic3ViIjoiZmZmZmZmZmY1N2E5ZjgxNGU0YjAwZDBhMjBiZjYwMjkiLCJiaCI6Ii02NDc0MTA2MzIiLCJoY2MiOiJVUyIsInR5cGUiOiJzZSIsImV4cCI6MTUyMTQ3MDg5MiwiaWF0IjoxNTIxNDUyODkxLCJjbGllbnRfaWQiOiJJMlJKZDdlTzVGOVQ2VTlUZ1ZLN1Z4dEFndzQ4dTBwVSIsInNlc3NpZCI6IjJjYTczNGUxLTc5OWQtNGE5MC04Y2NiLWY0NzMwN2M2ZmVkYSJ9.QHF_xNsCITCxGZd36oPRUdVXKNQ31W5K8SVtqZsBtUepW34_40HDTn5jF91sDIwjPzEALnSe4AiZY0TscJSbt7M3bRJ5VlBXMu33WiU2iC51K6R8ZOQw5IKL_-jncc81y-HO28Dchj9du1zcEslfLRXU8YAGPg_2A5de0DT8WFg';
function init() {
  // let redirectPiurl = window.location.href;
  // redirectPiurl = decodeURIComponent(redirectPiurl).replace(/\s/g, "+").replace(/%20/g, "+");
  // if (piSession) {
  //   piSession.getToken(function (result, userToken) {
  //     if (result === piSession['Success']) {
  //       piToken = userToken;
  //     } else if (result === 'unknown' || result === 'notoken') {
  //       piSession.login(redirectPiurl, 10);
  //     }
  //   });
  // }

  const notesList = [];
  const originalNotesList = [];

  let groups = [];
  let tocData;
  const getAllNotes = fetch('https://spectrum-qa.pearsoned.com/api/v1/context/5a9f8a6ce4b0576972d62596/identities/ffffffff57a9f814e4b00d0a20bf6029/notesX?pageId=ac2548718ca9f4783409d6b0f2786e86c57387500-e0d1331d346b484a8556f8d810dbdc2c', {
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
      const groupNote = noteObj.data;
      note.cardFormat = 'note';
      const contextualInfo = noteObj.contextualInfo;
      if (noteObj.pageId) {
        let titleIndex = _.findIndex(contextualInfo, function (obj) { return obj.key === 'title'; });
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
}
function callback(msg, data) {
  debugger;
  console.log('msg: ', msg);
  console.log('data: ', data);
}
function addNote() {
  const getAllNotes = fetch('https://spectrum-qa.pearsoned.com/api/v1/context/5a9f8a6ce4b0576972d62596/identities/ffffffff57a9f814e4b00d0a20bf6029/notesX?pageId=ac2548718ca9f4783409d6b0f2786e86c57387500-e0d1331d346b484a8556f8d810dbdc2c', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Authorization': piToken
    }
  }).then((res) => res.json()).then((json) => {
    console.log('Custom Note added!');
    console.log(json);
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
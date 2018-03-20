// In React, an owner is the component that sets the props of other components, if desired.
// (see https://facebook.github.io/react/docs/multiple-components.html)
//
// NOTE: If you want to reference another Origami component in this file's JSX below, import
// its src/js/component-owner.js directly from this project's /node_modules.

//import '../scss/component-specific.scss';

import React, { PropTypes } from 'react';
import { injectIntl } from 'react-intl';
import _ from 'lodash';

import NoteBook from './NoteBook';
import NoteBookHeader from './NoteBookHeader';



function refreshNotesList(originalNotesList, tagObject) {

  //  const tagName = state.expandedTagName;
  // const tagId = state.expandedTagId;
  const groups = [];
  const notesList = [];

  for (let ic = 0; ic < originalNotesList.length; ic++) {
    let note = _.cloneDeep(originalNotesList[ic]);
    const tagId = (note.tags) ? note.tags[0].tagId : '';
    if (tagId) {
      const index = _.findIndex(groups, function (o) { return o.tags[0].tagId === tagId; });

      note.selected = false;

      if (index === -1) {
        note.notes = [];
        note.notes.push(note);
        groups.push(note);
        console.log(groups);
      } else {
        note.tagId = null;
        note.tagName = null;
        groups[index].notes.push(note)
      }
    } else {
      notesList.push(note);
    }
  }
  if (groups.length) {
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
  }
  return notesList;
}



class ComponentOwner extends React.Component {

  //
  // Modify or add prop types to validate the properties passed to this component!
  // This is defined using an ES7 class property (transpiled by Babel Stage 0)
  //
  static propTypes = {
    notesList: PropTypes.array.isRequired,
    originalNotesList: PropTypes.array.isRequired,
    toolbarMode: PropTypes.object,
    groupModeFlag: PropTypes.bool
  };
  constructor(props) {
    super(props);
    let temporaryArray = props.notesList;
    temporaryArray.forEach(function (obj) { obj.keyId = obj.id + Date.now(); obj.selected = false; });
    this.state = {
      lists: props.lists,
      groupModeFlag: props.groupModeFlag,
      toolbarMode: props.toolbarMode,
      notesList: temporaryArray,
      saveNotesList: temporaryArray,
      originalNotesList: props.originalNotesList,
      tagAttributes: props.tagAttributes,
      groupExpanded: false,
      groupModeFlag: false,
      expandedTagName: null,
      expandedTagId: null
    };

  }
  callback = (msg, data) => {
    const notesList = [...this.state.notesList];
    const originalNotesList = [...this.state.originalNotesList];
    const tagObject = [...this.state.tagAttributes];
    const piToken = 'eyJraWQiOiJrMTYzMzQ3Mzg2MCIsImFsZyI6IlJTNTEyIn0.eyJzdWIiOiJmZmZmZmZmZjU5Y2JjMDRiZTRiMDllZmIzNDQwNWU1MiIsImhjYyI6IlVTIiwidHlwZSI6ImF0IiwiZXhwIjoxNTIxNTUwOTU0LCJpYXQiOjE1MjE1NDkxNTMsImNsaWVudF9pZCI6IkkyUkpkN2VPNUY5VDZVOVRnVks3Vnh0QWd3NDh1MHBVIiwic2Vzc2lkIjoiZmIwNWI1YjktMmQwOS00MjE3LWFhNTctNmRmYzBmN2VkN2MxIn0.QhvjqCT5BDVEvrCx9Nq-eLmpZVPi-Z2jm_8vfJfofPshIz1aY3AzlOkbSHvTAQQXDkFGntpN59zjjUcPKJwCjVwxQ2oaX7Bx8JXWV-XkLY7cj1leuHPbnXJs0DGn0HrzYKBqo3F6BWr1PARKD0AWtWwYnUkipXLI-h6c-FUb5eI';
    if (msg === 'ADD') {
      this.props.callback(msg, data);
      // notesList.splice(0, 0, {
      //   id: 'created' + notesList.length + 1,
      //   keyId: Date.now(),
      //   title: data.title,
      //   cardFormat: 'note',
      //   content: data.content,
      //   content2: 'this is test data',
      //   timeStamp: data.timeStamp,
      //   noteType: 'CUSTOM_NOTE'
      // });
      // this.setState({
      //   notesList: notesList
      // });
    } else if (msg === 'SAVE') {
       this.props.callback(msg, data);
      const index = _.findIndex(notesList, function (o) { return o.id === data.id; });
      if (index > -1) {
        notesList.splice(index, 1, data, function (formattedData) {

        });
        this.setState({
          notesList: notesList
        });
      }
    } else if (msg === 'DELETE') {
      this.props.callback(msg, data);
      const index = _.findIndex(originalNotesList, function (o) { return o.id === data.id; });
      if (index > -1) {
        originalNotesList.splice(index, 1);
      }
      this.setState({
        notesList: refreshNotesList(originalNotesList, tagObject),
        originalNotesList: originalNotesList
      });

    } else if (msg === 'NAVIGATE') {
      console.log('Navigation', data);

    } else if (msg === "GROUP") {
      notesList.forEach((item, i) => {
        item.keyId = item.id + Date.now();
        if (data === false) {
          item.selected = false;
        }
      });

      let toolbarMode = this.props.toolbarMode;
      toolbarMode.groupMode = 'GROUPSELECT'
      this.setState({
        notesList: notesList,
        toolbarMode: toolbarMode,
        groupModeFlag: data
      });
    } else if (msg === "SELECTED") {

      let toolbarMode = this.props.toolbarMode;
      toolbarMode.groupMode = 'SELECTED'
      toolbarMode.selectedCount = 0;
      const notesList = [...this.state.notesList];
      notesList.forEach((item, i) => {
        if (item.id === data.id) {
          item.selected = true;
        }
        if (item.selected) {
          toolbarMode.selectedCount++;
        }
      });


      this.setState({
        notesList: notesList,
        toolbarMode: toolbarMode,
        groupModeFlag: true
      });
    } else if (msg === "UNSELECTED") {

      let toolbarMode = this.props.toolbarMode;

      //   var newArray = JSON.parse(JSON.stringify(notesList));
      const notesList = [...this.state.notesList];
      let selectedCount = 0;
      notesList.forEach((item, i) => {
        if (item.id === data.id) {
          item.selected = false;
        }
        if (item.selected == true) {
          selectedCount++;
        }
      });

      if (selectedCount > 0) {
        toolbarMode.groupMode = 'SELECTED';
        toolbarMode.selectedCount = selectedCount;
      } else {
        toolbarMode.groupMode = 'GROUPSELECT';
        toolbarMode.selectedCount = selectedCount;
      }

      this.setState({
        notesList: notesList,
        toolbarMode: toolbarMode,
        groupModeFlag: true
      });
    } else if (msg === "SAVEGROUP") {
      let toolbarMode = this.props.toolbarMode;
      toolbarMode.groupMode = 'DEFAULT'
      const notesList = [...this.state.notesList];
      const originalNotesList = [...this.state.originalNotesList];
      const tempNotesList = [];
      let tagName = this.state.toolbarMode.groupTitle;
      let filterList = _.cloneDeep(notesList);
      let filterList1 = _.cloneDeep(notesList);
      let filterList2 = _.cloneDeep(notesList);
      let filterList3 = _.cloneDeep(notesList);

      filterList1 = filterList1.filter(notesList => notesList.selected === true);
      filterList2 = filterList2.filter(notesList => notesList.selected === true);
      filterList3 = filterList3.filter(notesList => notesList.selected === false);
      let groupPayload = {
        "tagName": tagName,
        "notes": []
      };
      filterList2.forEach((item, i) => {
        let selectedObj = {
          "id": item.id
        }
        groupPayload.notes.push(selectedObj);
      });
      const getTagId = fetch('https://spectrum-qa.pearsoned.com/api/v1/context/5a9f8a6ce4b0576972d62596/identities/ffffffff57a9f814e4b00d0a20bf6029/notesX/tag', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Authorization': piToken
        },
        body: JSON.stringify(groupPayload)
      }).then((res) => res.json()).then((json) => {
        let tagId = json.tagId;
        let tagName = json.tagName;
        filterList2.forEach((item, i) => {
          const index = _.findIndex(originalNotesList, function (o) { return o.id === item.id; });
          if (index != -1) {
            if (originalNotesList[index].tags) {
              originalNotesList[index].tags[0].tagId = tagId;
              originalNotesList[index].tags[0].tagName = tagName;
            } else {
              originalNotesList[index].tags = [{
                'tagId': tagId,
                'tagName': tagName
              }];
            }
          }
          //    item.tagId = null;
        });
        this.setState({
          notesList: refreshNotesList(originalNotesList, tagObject),
          originalNotesList: originalNotesList,
          toolbarMode: toolbarMode,
          groupModeFlag: false
        });
      });
      //   filterList2.splice(0, 1);

      // filterList1[0].tagId = tagId;
      // filterList1[0].tagName = tagName;
      // filterList1[0].notes = filterList2;

      // filterList3.push(filterList1[0]);
      // filterList3.forEach((item, i) => {
      //   item.selected = false;
      // });
    } else if (msg === "RENAME") {
      let tagId = (data.tags && data.tags[0].tagId) ? data.tags[0].tagId : '';
      let tagName = (data.tags && data.tags[0].tagName) ? data.tags[0].tagName : '';
      let renamePayLoad = {
        "tagName": tagName,
        "notes": []
      }
      const renameGroup = fetch(`https://spectrum-qa.pearsoned.com/api/v1/context/5a9f8a6ce4b0576972d62596/identities/ffffffff57a9f814e4b00d0a20bf6029/notesX/tag/${tagId}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Authorization': piToken
        },
        body: JSON.stringify(renamePayLoad)
      }).then((res) => res.json()).then((json) => {
        let renamedtagId = json.tagId;
        let renamedtagName = json.tagName;
        let updatedtagObj = tagObject;
        _.each(updatedtagObj, (obj, index) => {
          if (updatedtagObj[index].tagId === tagId) {
            updatedtagObj[index].tagName = renamedtagName;
          }
        });
        this.setState({
          notesList: refreshNotesList(originalNotesList, updatedtagObj),
          originalNotesList: originalNotesList,
          tagAttributes: updatedtagObj,
          groupExpanded: false,
          groupModeFlag: false,
          expandedTagName: null,
          expandedTagId: null
        });
      });
    } else if (msg === "UNGROUP NOTE") {

      const originalNotesList = [...this.state.originalNotesList];
      const tagName = this.state.expandedTagName;
      const tagId = this.state.expandedTagId;
      const groups = [];
      const notesList = [];

      const index = _.findIndex(originalNotesList, function (o) { return o.id === data.id; });
      originalNotesList[index].tagId = null;
      originalNotesList[index].tagName = null;

      //  refreshNotesList(originalNotesList);

      this.setState({
        notesList: refreshNotesList(originalNotesList, tagObject),
        originalNotesList: originalNotesList,
        groupExpanded: false,
        groupModeFlag: false,
        expandedTagName: null,
        expandedTagId: null
      });


    } else if (msg === "UNGROUP NOTES") { // ungroup all notes in a group
      this.props.callback(msg, data);
      const originalNotesList = [...this.state.originalNotesList];

      originalNotesList.map((item, i) => {
        if (item.tags && item.tags[0].tagId === data.tags[0].tagId) {
          item.tags[0].tagId = null;
          item.tags[0].tagName = null;
        }
      });


      this.setState({
        notesList: refreshNotesList(originalNotesList, tagObject),
        originalNotesList: originalNotesList,
        groupExpanded: false,
        groupModeFlag: false,
        expandedTagName: null,
        expandedTagId: null
      });


    }
  }

  handleGroupClick = (tagId, tagName) => {
    const notesList = [...this.state.notesList];
    //  const tempNotesList = [...this.state.notesList];

    const tempNotesList = _.cloneDeep(notesList);
    let filterList = tempNotesList.filter(notesList => notesList.tags && notesList.tags[0].tagId === tagId);

    for (let i = 0; i < filterList[0].notes.length; i++) {
      filterList[0].notes[i].tags[0].tagId = null;
      filterList[0].tags[0].tagId = null;
    }
    this.setState({
      notesList: filterList[0].notes,
      groupExpanded: true,
      //   groupModeFlag: true,
      expandedTagName: tagName,
      expandedTagId: tagId
    });
  }

  handleBack = () => {
    this.setState({
      //  notesList: this.props.notesList,
      notesList: refreshNotesList(this.state.originalNotesList, this.state.tagAttributes),
      //  notesList: this.state.saveNotesList,
      groupExpanded: false,
      groupModeFlag: false,
      expandedTagName: null,
      expandedTagId: null
    });
  }
  //
  // Note that combining the fat arrow syntax with ES7 class properties (transpiled by Babel Stage 0), we eliminate the
  // need to do manual binding of the 'this' context in event handlers or callbacks. React binds all other contexts
  // as expected.
  //

  render() {
    console.log('Owner RENDER called');
    const { notesList, groupModeFlag, toolbarMode, groupExpanded, expandedTagName, expandedTagId } = this.state;
    return (
      <div>
        <NoteBook notesList={notesList} groupExpanded={groupExpanded} expandedTagName={expandedTagName} expandedTagId={expandedTagId} handleBack={this.handleBack} toolbarMode={toolbarMode} tocData={this.props.tocData} groupModeFlag={groupModeFlag} callback={this.callback} handleGroupClick={this.handleGroupClick} coloums={4} />
      </div>
    );
  };
}

export default injectIntl(ComponentOwner); // Inject this.props.intl into the component context

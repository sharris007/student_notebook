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
    const piToken = 'eyJraWQiOiJrMTYzMzQ3Mzg2MCIsImFsZyI6IlJTNTEyIn0.eyJoY2MiOiJVUyIsInN1YiI6ImZmZmZmZmZmNTdhOWY4MTRlNGIwMGQwYTIwYmY2MDI5IiwidHlwZSI6ImF0IiwiZXhwIjoxNTIyMDg0NTQ4LCJpYXQiOjE1MjIwNzM3NDcsInNlc3NpZCI6ImU1OWVhZjNmLTAzMGItNDhkZS05ZTQzLTYyYzM0MjJkMTI2MiJ9.ADw2dIr7FmjK6mAAMG_DukS75R-xmOElFM94LPPkIqxmlfWZWBGrhlxjsmfsthT9Qnw382OnnLyIgitECMduv65e0ahdgk_EIJqf3-LER460q4PBbbDUBgQripF7gqNPt1pxCmF8VijzP74x96S1mMbDFyqXbgffFJugs5Ab1AI';
    if (msg === 'ADD') {
      this.props.callback(msg, data);
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


    } else if (msg === 'NAVIGATE') {

    } else if (msg === "GROUP") {
      // this.props.callback(msg, data);s
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
      let tagId = Date.now();
      let tagName = toolbarMode.groupTitle;

      if (data.groupId !== null) {
        tagId = data.groupId;
        tagName = data.groupTitle;
      }

      if (!!!tagName) {
        tagName = 'Untitled Group';
      }


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
        item.selected = false;
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
        let updatedObject = tagObject;
        ;
        updatedObject.push(json);
        this.setState({
          notesList: refreshNotesList(originalNotesList, updatedObject),
          originalNotesList: originalNotesList,
          toolbarMode: toolbarMode,
          tagAttributes: updatedObject,
          groupModeFlag: false
        });
      });
      //   filterList2.splice(0, 1);

      filterList1[0].tagId = tagId;
      filterList1[0].tagName = tagName;
      filterList1[0].notes = filterList2;
      filterList1[0].selected = false;

      filterList3.push(filterList1[0]);
    }else if (msg === "EDITGROUP") {
      console.log('add note group');
      let toolbarMode = this.props.toolbarMode;
      toolbarMode.groupMode = 'DEFAULT'
      const notesList = [...this.state.notesList];
      const originalNotesList = [...this.state.originalNotesList];
      const tempNotesList = [];
      let tagId = Date.now();
      let tagName = toolbarMode.groupTitle;

      if (data.groupId !== null) {
        tagId = data.groupId;
        tagName = data.groupTitle;
      }

      if (!!!tagName) {
        tagName = 'Untitled Group';
      }


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

      const getTagId = fetch('https://spectrum-qa.pearsoned.com/api/v1/context/5a9f8a6ce4b0576972d62596/identities/ffffffff57a9f814e4b00d0a20bf6029/notesX/tag/'+tagId, {
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
        let updatedObject = tagObject;
        ;
        updatedObject.push(json);
        let newGroups = toolbarMode.groups;
        newGroups.push(json);
        this.setState({
          notesList: refreshNotesList(originalNotesList, updatedObject),
          originalNotesList: originalNotesList,
          toolbarMode: toolbarMode,
          tagAttributes: updatedObject,
          groupModeFlag: false
        });
      });
      //   filterList2.splice(0, 1);

      filterList1[0].tagId = tagId;
      filterList1[0].tagName = tagName;
      filterList1[0].notes = filterList2;
      filterList1[0].selected = false;

      filterList3.push(filterList1[0]);
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

      const index = _.findIndex(tagObject, function (o) { return o.tagId === data.tags[0].tagId; });
      if (index != -1) {
        tagObject.splice(index, 1);
      }
      this.setState({
        notesList: refreshNotesList(originalNotesList, tagObject),
        originalNotesList: originalNotesList,
        tagAttributes: tagObject,
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
    const { notesList, groupModeFlag, toolbarMode, groupExpanded, expandedTagName, tagAttributes, expandedTagId } = this.state;
    return (
      <div>
        <NoteBook notesList={notesList} groupExpanded={groupExpanded} expandedTagName={expandedTagName} tagAttributes={tagAttributes} expandedTagId={expandedTagId} handleBack={this.handleBack} toolbarMode={toolbarMode} tocData={this.props.tocData} groupModeFlag={groupModeFlag} callback={this.callback} handleGroupClick={this.handleGroupClick} coloums={4} />
      </div>
    );
  };
}

export default injectIntl(ComponentOwner); // Inject this.props.intl into the component context

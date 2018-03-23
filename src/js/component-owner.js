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



function refreshNotesList(originalNotesList) {

  //  const tagName = state.expandedTagName;
  // const tagId = state.expandedTagId;
  const groups = [];
  const notesList = [];

  for (let ic = 0; ic < originalNotesList.length; ic++) {
    let note = _.cloneDeep(originalNotesList[ic]);

    if (note.tagId) {
      const index = _.findIndex(groups, function (o) { return o.tagId === note.tagId; });

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
  groups.map((group, i) => {
    notesList.unshift(group);
  });

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
      groupExpanded: false,
      groupModeFlag: false,
      expandedTagName: null,
      expandedTagId: null
    };

  }
  callback = (msg, data) => {
    const notesList = [...this.state.notesList];
    const originalNotesList = [...this.state.originalNotesList];
    if (msg === 'ADD') {
      notesList.splice(0, 0, {
        id: 'created' + notesList.length + 1,
        keyId: Date.now(),
        title: data.title,
        cardFormat: 'note',
        content: data.content,
        content2: 'this is test data',
        changeDate: data.changeDate,
        noteText: 'C'
      });
      this.setState({
        notesList: notesList
      });
    } else if (msg === 'SAVE') {
      const index = _.findIndex(notesList, function (o) { return o.id === data.id; });
      if (index > -1) {
        notesList.splice(index, 1, data);
        this.setState({
          notesList: notesList
        });
      }
    } else if (msg === 'DELETE') {

      const index = _.findIndex(originalNotesList, function (o) { return o.id === data.id; });
      if (index > -1) {
        originalNotesList.splice(index, 1);
      }
      this.setState({
        notesList: refreshNotesList(originalNotesList),
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

      filterList2.forEach((item, i) => {
        item.tagId = null;
        item.selected = false;
      });

      //   filterList2.splice(0, 1);

      filterList1[0].tagId = tagId;
      filterList1[0].tagName = tagName;
      filterList1[0].notes = filterList2;
      filterList1[0].selected = false;

      filterList3.push(filterList1[0]);


      this.setState({
        notesList: filterList3,
        orinignalNotesList: filterList3,
        toolbarMode: toolbarMode,
        groupModeFlag: false
      });



    } else if (msg === "RENAME") {
      console.log('Re Name');
      console.log('Data', data);
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
        notesList: refreshNotesList(originalNotesList),
        originalNotesList: originalNotesList,
        groupExpanded: false,
        groupModeFlag: false,
        expandedTagName: null,
        expandedTagId: null
      });


    } else if (msg === "UNGROUP NOTES") { // ungroup all notes in a group
      const originalNotesList = [...this.state.originalNotesList];

      originalNotesList.map((item, i) => {
        if (item.tagId === data.tagId) {
          item.tagId = null;
          item.tagName = null;
        }
      });


      this.setState({
        notesList: refreshNotesList(originalNotesList),
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
    let filterList = tempNotesList.filter(notesList => notesList.tagId === tagId);

    filterList[0].notes[0].tagId = null;
    filterList[0].tagId = null;
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
      notesList: refreshNotesList(this.state.originalNotesList),
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
        <NoteBook notesList={notesList} groupExpanded={groupExpanded} expandedTagName={expandedTagName} expandedTagId={expandedTagId} handleBack={this.handleBack} toolbarMode={toolbarMode} tocData={this.props.tocData} groupModeFlag={groupModeFlag} callback={this.callback} handleGroupClick={this.handleGroupClick} coloums={3} />
      </div>
    );
  };
}

export default injectIntl(ComponentOwner); // Inject this.props.intl into the component context

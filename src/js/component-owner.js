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


class ComponentOwner extends React.Component {

  //
  // Modify or add prop types to validate the properties passed to this component!
  // This is defined using an ES7 class property (transpiled by Babel Stage 0)
  //
  static propTypes = {
    notesList: PropTypes.array.isRequired,
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
      groupExpanded: false,
      expandedTagName: null
    };

  }
  callback = (msg, data) => {
    const notesList = [...this.state.notesList];
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
      const index = _.findIndex(notesList, function (o) { return o.id === data.id; });
      if (index > -1) {
        notesList.splice(index, 1);
      }
      notesList.forEach((item, i) => {
        item.keyId = item.id + Date.now();
      });

      this.setState({
        notesList: notesList
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
      //   var newArray = JSON.parse(JSON.stringify(notesList));
      const notesList = [...this.state.notesList];
      notesList.forEach((item, i) => {
        if (item.id === data.id) {
          item.selected = true;
        }
        if (item.selected){
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

      notesList.splice(0, 0, {
        id: 'created' + notesList.length + 1,
        keyId: notesList.length + Date.now(),
        colorCode: 'GROUP',
        title: data.groupTitle,
        cardFormat: 'note',
        noteText: 'G',
        content: data.content,
        content2: 'this is test data',
        changeDate: Date.now()
      });



      notesList.forEach((item, i) => {
        if (item.selected) {
          notesList.splice(i, 1);
        }
      });

      notesList.forEach((item, i) => {
        item.keyId = item.id + Date.now();
      });

      this.setState({
        notesList: notesList,
        toolbarMode: toolbarMode,
        groupModeFlag: false
      });

    } else if (msg === "RENAME") {
      console.log('Re Name');
      console.log('Data', data);
    } else if (msg === "UNGROUP") {
      console.log('UNGROUP');
      console.log('Data', data);
    }
  }

  handleGroupClick = (tagId, tagName) => {
    console.log('BEFORE..');
    const notesList = [...this.state.notesList];
    console.log(notesList);
    debugger;
    let filterList = notesList.filter(notesList => notesList.tagId === tagId && notesList.noteText !== 'G');
    console.log('AFTER..');
    console.log(filterList);
     this.setState({
        notesList: filterList,
        groupExpanded: true,
        expandedTagName: tagName
      });
  }

  handleBack = () => {
      this.setState({
        notesList: this.props.notesList,
        groupExpanded: false,
        expandedTagName: null
      });
  }
  //
  // Note that combining the fat arrow syntax with ES7 class properties (transpiled by Babel Stage 0), we eliminate the
  // need to do manual binding of the 'this' context in event handlers or callbacks. React binds all other contexts
  // as expected.
  //

  render() {
    console.log('Owner RENDER called');
    const { notesList, groupModeFlag, toolbarMode, groupExpanded, expandedTagName } = this.state;
    return (
      <div>
        <NoteBook notesList={notesList} groupExpanded={groupExpanded} expandedTagName={expandedTagName} handleBack={this.handleBack} toolbarMode={toolbarMode} tocData={this.props.tocData} groupModeFlag={groupModeFlag} callback={this.callback} handleGroupClick={this.handleGroupClick} coloums={3} />
      </div>
    );
  };
}

export default injectIntl(ComponentOwner); // Inject this.props.intl into the component context

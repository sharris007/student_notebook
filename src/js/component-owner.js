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
      notesList: temporaryArray
    };

  }
  callback = (msg, data) => {
    debugger;
    const notesList = [...this.state.notesList];
    if (msg === 'ADD') {
      notesList.splice(0, 0, {
        id: 'created' + notesList.length + 1,
        title: data.title,
        cardFormat: 'note',
        content: data.content,
        content2: 'this is test data',
        changeDate: data.changeDate
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
        this.setState({
          notesList: notesList
        });
      }
    } else if (msg === 'NAVIGATE') {
      console.log('Navigation', data);

    } else if (msg === "GROUP") {
      const temporaryNotesList = [...this.state.notesList];
      //   var newArray = JSON.parse(JSON.stringify(notesList));

      temporaryNotesList.forEach((item, i) => {
        item.keyId = item.id + Date.now();
        if (data === false) {
          item.selected = false;
        }
        notesList.splice(i, 1, item);
      });

      notesList.forEach((item, i) => {
        item.keyId = item.id + Date.now();
      });

      this.setState({
        notesList: notesList,
        toolbarMode: 'GROUPSELECT',
        groupModeFlag: data
      });
    } else if (msg === "SELECTED") {
      //   var newArray = JSON.parse(JSON.stringify(notesList));
      const notesList = [...this.state.notesList];
      debugger;
      notesList.forEach((item, i) => {
        if (item.id === data.id) {
          item.selected = true;
        }
      });


      this.setState({
        notesList: notesList,
        toolbarMode: 'GroupSelect',
        groupModeFlag: true
      });
    }
  }



  //
  // Note that combining the fat arrow syntax with ES7 class properties (transpiled by Babel Stage 0), we eliminate the
  // need to do manual binding of the 'this' context in event handlers or callbacks. React binds all other contexts
  // as expected.
  //

  render() {
    const { notesList, groupModeFlag, toolbarMode } = this.state;
    return (
      <div>
        <NoteBookHeader toolbarMode={toolbarMode} callback={this.callback}></NoteBookHeader>
        <NoteBook notesList={notesList} groupModeFlag={groupModeFlag} callback={this.callback} coloums={3} />
      </div>
    );
  };
}

export default injectIntl(ComponentOwner); // Inject this.props.intl into the component context

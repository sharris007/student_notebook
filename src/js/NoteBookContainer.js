// In React, an owner is the component that sets the props of other components, if desired.
// (see https://facebook.github.io/react/docs/multiple-components.html)
//
// NOTE: If you want to reference another Origami component in this file's JSX below, import
// its src/js/component-owner.js directly from this project's /node_modules.

//import '../scss/component-specific.scss';

import React, {PropTypes} from 'react';
import {injectIntl} from 'react-intl';
import _ from 'lodash';

import NoteBookBoard from './NoteBook';
import NoteBookHeader from './NoteBookHeader';


class NoteBook extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <NoteBookHeader callback={this.props.callback} tocData={this.props.tocData} notesList={this.props.notesList}></NoteBookHeader>
        <NoteBookBoard notesList={this.props.notesList} tocData={this.props.tocData} groupModeFlag={this.props.groupModeFlag} callback={this.props.callback} handleGroupClick={this.props.handleGroupClick} coloums={this.props.coloums}/>
      </div>
    );
  };  
}

export default NoteBook; 

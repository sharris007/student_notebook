import React, { Component, PropTypes } from 'react';
import '../assets/temp.styl';
import RaisedButton from 'material-ui/RaisedButton';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import FontIcon from 'material-ui/FontIcon';
import TextField from 'material-ui/TextField';
import { orange500, blue500 } from 'material-ui/styles/colors';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Checkbox from 'material-ui/Checkbox';

const VerticalLine = () => (
  <div style={{ float: 'left', borderLeft: '2px solid lightgrey', height: '40px', marginLeft: '10px', marginRight: '10px' }}></div>
);


const styles = {
  errorStyle: {
    color: orange500,
  },
  underlineStyle: {
    borderColor: blue500,
  },
  floatingLabelStyle: {
    color: orange500,
  },
  floatingLabelFocusStyle: {
    color: blue500,
  }
};




let groupModeToggleFlag = false;



export default class NoteBookHeader extends Component {
  static propTypes = {
    callback: PropTypes.func,
    toolbarMode: PropTypes.object
  };




  constructor(props) {
    debugger;
    super(props);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleGroupSaveButton = this.handleGroupSaveButton.bind(this);
    this.handleGroupNotesButton = this.handleGroupNotesButton.bind(this);
    this.handleNewGroupButton = this.handleNewGroupButton.bind(this);
    this.handleCancelButton = this.handleCancelButton.bind(this);
    // const lists = [...props.lists];

    this.state = {
      isScrolling: false,
      search: '',
      ider: null,
      menuBarClass: 'test',
      showGroupInputTitle: false,
      toolbarMode: props.toolbarMode,
      groupTitle: ''
    };

  }



  handleOnChange(event) {
    this.props.getLists(6);
    this.setState({ search: event.target.value });
  }

  handleGroupNotesButton(event) {
    groupModeToggleFlag = !groupModeToggleFlag;
    this.props.callback('GROUP', groupModeToggleFlag);
  }

  handleCancelButton(event) {
    groupModeToggleFlag = !groupModeToggleFlag;
    this.setState({ showGroupTitleInput: false, groupTitle: '' });
    this.props.callback('GROUP', groupModeToggleFlag);
  }

  handleNewGroupButton(event) {
    let toolbarMode =
      this.setState({ showGroupTitleInput: true });
  }

  handleGroupSaveButton(event) {
    let toolbarMode = this.props.toolbarMode;
    toolbarMode.groupTitle = this.state.groupTitle;
    toolbarMode.groupMode = 'DEFAULT';
    groupModeToggleFlag = false;
    this.setState({ showGroupTitleInput: false, groupTitle: '' });
    this.props.callback('SAVEGROUP', toolbarMode);
  }

  handleGroupTitleChange(e) {
    let toolbarMode = this.state.toolbarMode;
    toolbarMode.groupTitle = e.target.value;
    this.setState({ groupTitle: e.target.value, toolbarMode });
  }

  render() {
    debugger;

    const { toolbarMode } = this.state;
    return (



      <div style={{ marginLeft: '-180px' }}>

        <Toolbar style={{ height: '90px', position: 'fixed', width: '100%', 'zIndex': '1' }}>
          <ToolbarGroup >
            <FontIcon className="muidocs-icon-custom-sort" />
            {groupModeToggleFlag === false ? <RaisedButton label="All" buttonStyle={{ borderRadius: 25 }} labelColor={'white'} backgroundColor={"gray"} style={{ borderRadius: 25 }} onClick={() => this.handleGroupNotesButton()} />
              : null}
            {groupModeToggleFlag === false ? <ToolbarSeparator />
              : null}
            {groupModeToggleFlag === false ? <RaisedButton label='Chapters' onClick={() => this.handleGroupNotesButton()} />
              : null}
            {groupModeToggleFlag === false ? <RaisedButton label="Label" onClick={() => this.handleGroupNotesButton()} />
              : null}

            {groupModeToggleFlag === true && toolbarMode.groupMode !== 'SELECTED' ? <span style={{ position: 'fixed', right: '50%' }}>Select notes to group</span>
              : null}

            {groupModeToggleFlag === true && toolbarMode.groupMode === 'SELECTED' && toolbarMode.selectedCount === 1 ? <span style={{ position: 'fixed', right: '50%' }}>{toolbarMode.selectedCount} note selected</span>
              : null}

            {groupModeToggleFlag === true && toolbarMode.groupMode === 'SELECTED' && toolbarMode.selectedCount > 1 ? <span style={{ position: 'fixed', right: '50%' }}>{toolbarMode.selectedCount} notes selected</span>
              : null}

          </ToolbarGroup>
          <ToolbarGroup>
            <FontIcon className="muidocs-icon-custom-sort" />

            {this.state.showGroupTitleInput === true ? <div><TextField
              onChange={(e) => { this.handleGroupTitleChange(e) }}
              // value={this.state.groupTitle}
              style={{ marginBottom: '10px' }}
              floatingLabelText="Group title"
              defaultValue="Untitled group"
              underlineStyle={styles.underlineStyle}
            /><span style={{ paddingRight: '50px' }}></span></div> : null}
            {groupModeToggleFlag === false ? <RaisedButton label="Group notes" style={{ float: 'right' }} onClick={() => this.handleGroupNotesButton()} />
              : null}
            {groupModeToggleFlag === true ? <RaisedButton label="Cancel" style={{ float: 'right' }} onClick={() => this.handleCancelButton()} />
              : null}

            {toolbarMode.groupMode === 'SELECTED' && !this.state.showGroupTitleInput ? <RaisedButton label="New Group" style={{ float: 'right' }} onClick={() => this.handleNewGroupButton()} />
              : null}
            {this.state.showGroupTitleInput === true ? <RaisedButton label="Save" onClick={() => this.handleGroupSaveButton(event)} />
              : null}
          </ToolbarGroup>
        </Toolbar>
        <br />
      </div>
    );
  }
}

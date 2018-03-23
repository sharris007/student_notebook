import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import '../assets/temp.styl';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import FontIcon from 'material-ui/FontIcon';
import TextField from 'material-ui/TextField';
import { orange500, blue500 } from 'material-ui/styles/colors';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Checkbox from 'material-ui/Checkbox';
import '../scss/notebook.scss';
import dropdown from '../images/dropdown.png';
import MenuItem from './menuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItemMaterial from 'material-ui/MenuItem';
import Menu from 'material-ui/Menu';
import Paper from 'material-ui/Paper';


const layerPng = require('../assets/images/ic-group.png');


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

const buttonStyles = {
  float: 'left',
  marginRight: '10px',
  background: 'white',
  borderColor: 'grey',
  borderWidth: '2px',
  borderRadius: '2px',
  fontSize: '15px',
  width: '100px',
  height: '40px',
  color: 'grey',
  cursor: 'pointer'
};

const buttonCancelStyle = {
  backgroundColor: '#e9e9e9',
  borderColor: '#c7c7c7',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderRadius: '2px',
  fontFamily: 'OpenSans',
  fontSize: '14px',
  fontWeight: '600',
  lineHeight: '1.29',
  width: '110px',
  height: '36px',
  cursor: 'pointer',
  paddingTop: '9px',
  paddingBottom: '9px',
  paddingLeft: '12px',
  paddingRight: '12px'
};

const buttonAddToGroupStyle = {
  backgroundColor: '#e9e9e9',
  borderColor: '#c7c7c7',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderRadius: '2px',
  fontFamily: 'OpenSans',
  fontSize: '14px',
  fontWeight: '600',
  lineHeight: '1.29',
  height: '36px',
  cursor: 'pointer',
  paddingTop: '9px',
  paddingBottom: '9px',
};



const listStyle = {
  padding: '10px'
}
const listboxStyle = {
  padding: '10px',
  background: '#fff',
  position: 'absolute',
  top: '75px',
  minWidth: '300px',
  maxHeight: '300px',
  overflowY: 'auto',
  boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.3)'
}
const listboxStyleLabel = {
  padding: '10px',
  background: '#fff',
  position: 'absolute',
  top: '75px',
  minWidth: '239px',
  boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.3)'
}
const chkBoxiconStyle = {
  fill: 'gray'
}
let groupModeToggleFlag = false;


export default class NoteBookHeader extends Component {
  static propTypes = {
    callback: PropTypes.func,
    toolbarMode: PropTypes.object,
    groupExpanded: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.menuItems = this.menuItems.bind(this);
    this.handleGroupSaveButton = this.handleGroupSaveButton.bind(this);
    this.handleGroupNotesButton = this.handleGroupNotesButton.bind(this);
    this.handleNewGroupButton = this.handleNewGroupButton.bind(this);
    this.handleCancelButton = this.handleCancelButton.bind(this);
    this.handleGroupDropDownMenu = this.handleGroupDropDownMenu.bind(this);
    this.handleAddToGroupButton = this.handleAddToGroupButton.bind(this);
    // const lists = [...props.lists];
    console.log(props);
    this.state = {
      isScrolling: false,
      search: '',
      ider: null,
      values: [],
      showChapterMenu: false,
      showLabelMenu: false,
      chapterText: 'Chapter',
      labelText: 'Labels',
      menuBarClass: 'test',
      showGroupInputTitle: false,
      toolbarMode: props.toolbarMode,
      groupTitle: '',
      groupId: null,
      groupModeDrop: false
    };

    const labelAllObj = {
      "id": "All",
      "title": "All Labels",
      "labelName": 'All Chapters'
    };
    (this.props.tocData.items).unshift(labelAllObj);


  }

  componentDidMount = () => {
    window.addEventListener('click', this.domClick, false);
  }

  domClick = (e) => {
    if (!ReactDOM.findDOMNode(this).contains(e.target)) {
      this.setState({
        showChapterMenu: false, showLabelMenu: false
      });
    }

  }

  handleOnChange(event) {
    this.props.getLists(6);
    this.setState({ search: event.target.value });
  }

  handleGroupNotesButton(event) {
    groupModeToggleFlag = !groupModeToggleFlag;
    this.props.callback('GROUP', groupModeToggleFlag);
  }

  handleChange = (getVal) => {
    if (getVal === 'chapter') {
      const toggledIsOpen = this.state.showChapterMenu ? false : true;
      this.setState({ showChapterMenu: toggledIsOpen, showLabelMenu: false });
    }
    else if (getVal === 'label') {
      const toggledIsOpen = this.state.showLabelMenu ? false : true;
      this.setState({ showLabelMenu: toggledIsOpen, showChapterMenu: false });
    }
    else {
      this.setState({ showChapterMenu: false, showLabelMenu: false, chapterText: 'Chapter', labelText: 'Labels' });
      localStorage.setItem('labelItem', JSON.stringify([]));
      localStorage.setItem('chapterItem', JSON.stringify([]));
      this.getSelectedVal();
    }

  }
  getSelectedVal = () => {
    const props = this.props;
    const selectedChapter = JSON.parse(localStorage.getItem("chapterItem")) ? JSON.parse(localStorage.getItem("chapterItem")) : [];
    const selectedLabel = JSON.parse(localStorage.getItem("labelItem")) ? JSON.parse(localStorage.getItem("labelItem")) : [];
    var tocLevel = props.tocData.items;
    let updateChapterTxt = selectedChapter.length > 0 ? "Chapter" + ' ' + selectedChapter.length : 'Chapter';
    let updateLabelTxt = selectedLabel.length > 0 ? selectedLabel.length + ' ' + "Labels" : 'Labels';
    this.setState({ chapterText: updateChapterTxt, labelText: updateLabelTxt });
    const tocListItem = [];
    for (let i = 0; i < selectedChapter.length; i++) {
      tocLevel.find((toc) => {
        if (toc.id === selectedChapter[i]) {
          tocListItem.push(toc);
        }
      });
    }

    let chapterList = [];
    let finalFilteredList = [];
    const note = props.notesList;
    for (let i1 = 0; i1 < tocListItem.length; i1++) {
      if (typeof tocListItem[i1].items !== 'undefined' && tocListItem[i1].items.length > 0) {
        for (let j1 = 0; j1 < tocListItem[i1].items.length; j1++) {
          note.find((note) => {
            if (tocListItem[i1].items[j1].id === note.pageId) {
              chapterList.push(note)
            }
          });
        }
      }
    }
    const checkChapterList = chapterList.length;
    if (checkChapterList > 0) {
      if (selectedLabel.length > 0) {
        for (let c = 0; c < chapterList.length; c++) {
          selectedLabel.find((label) => {
            if ((chapterList[c].noteType === label && !chapterList[c].tags) || (label === 'NL' && !chapterList[c].noteType)) {
              finalFilteredList.push(chapterList[c]);
            }
          });
        }
      }
      else {
        finalFilteredList = chapterList;
      }

    }
    else {
      for (let c = 0; c < note.length; c++) {
        selectedLabel.find((label) => {
          if ((note[c].noteType === label && !note[c].tags) || (label === 'NL' && !note[c].noteType)) {
            finalFilteredList.push(note[c]);
          }
        });
      }
    }
    this.props.getFilterArr(finalFilteredList);

  }
  handleCancelButton(event) {
    groupModeToggleFlag = !groupModeToggleFlag;
    this.setState({ showGroupTitleInput: false, groupTitle: '', groupId: null, groupModeDrop: false  });
    this.props.callback('GROUP', groupModeToggleFlag);
  }

  handleAddToGroupButton(event) {
    this.setState({ groupModeDrop: true });
  }

  handleGroupDropDownMenu(event, value, index) {
    let toolbarMode = this.props.toolbarMode;
    toolbarMode.groupTitle = event.target.outerText;
    toolbarMode.groupId = value;
    toolbarMode.groupMode = 'DEFAULT';
    groupModeToggleFlag = false;
    this.setState({ showGroupTitleInput: false, groupTitle: '', groupId: null });
    this.props.callback('SAVEGROUP', toolbarMode);
  }


  handleNewGroupButton(event) {
    let toolbarMode =
      this.setState({ showGroupTitleInput: true });
  }
  handleGroupSaveButton(event) {
    let toolbarMode = this.props.toolbarMode;
    toolbarMode.groupTitle = this.state.groupTitle;
    toolbarMode.groupId = this.state.groupId;
    toolbarMode.groupMode = 'DEFAULT';
    groupModeToggleFlag = false;
    this.setState({ showGroupTitleInput: false, groupTitle: '', groupId: null });
    this.props.callback('SAVEGROUP', toolbarMode);
  }

  menuItems = (values, fun) => {
    return values.map((val) => (
      <MenuItem content={val} label={val.labelName ? val.labelName : val.title} labelCode={val.labelCode ? val.labelCode : ''} getSelectedVal={this.getSelectedVal} />
    ));
  }
  handleGroupTitleChange(e) {
    let toolbarMode = this.state.toolbarMode;
    toolbarMode.groupTitle = e.target.value;
    this.setState({ groupTitle: e.target.value, toolbarMode });
  }

  handleGoToNotes = () => {
    this.props.handleBack();
  }
  render() {
    const { toolbarMode } = this.state;
    const labelObj = [
      {
        "labelName": "Main ideas",
        "labelCode": "MAIN_IDEAS",
        "id": "main_ideas"
      },
      {
        "labelName": "From Instructor",
        "labelCode": "FROM_INSTRUCTOR",
        "id": "from_instructor"
      },
      {
        "labelName": "Observations",
        "labelCode": "OBSERVATIONS",
        "id": "observations"
      },
      {
        "labelName": "Questions",
        "labelCode": "QUESTIONS",
        "id": "questions"
      },
      {
        "labelName": "No Label",
        "labelCode": "CUSTOM_NOTE",
        "id": "custom_notes"
      }
    ];

    return (
      <div style={{ marginLeft: '-180px' }}>

        {this.props.groupExpanded === false ?
          <Toolbar className={(groupModeToggleFlag === true) ? 'groupSelect' : null} style={{ height: '80px', position: 'fixed', width: '100%', zIndex: '1001', backgroundColor: '#f5f5f5' }}>
            <ToolbarGroup style={{ paddingLeft: '70px' }}>
              <FontIcon className="muidocs-icon-custom-sort" />
              {groupModeToggleFlag === false ? <div className={
                (this.state.chapterText === 'Chapter' && this.state.labelText === 'Labels') ? 'all active' : 'all'
              } onClick={() => this.handleChange('all')}>All</div>
                : null}
              {groupModeToggleFlag === false ? <ToolbarSeparator style={{ color: '#e7e7e7', width: '2px', margin: '0px 22px 0px 18px', height: '20px' }} />
                : null}
              {groupModeToggleFlag === false ? <div> <div className='all filterLabel' onClick={() => this.handleChange('chapter')}><span className={
                (this.state.chapterText === 'Chapter') ? 'default' : 'active'
              }>{this.state.chapterText}</span><img className='dropdownImg' src={dropdown} alt="arrow" /> </div>  {this.state.showChapterMenu ?
                <div style={listboxStyle} >{this.menuItems(this.props.tocData.items)}</div> : null}</div>
                : null}
              {groupModeToggleFlag === false ? <div><div className='all filterLabel' onClick={() => this.handleChange('label')}><span className={
                (this.state.labelText === 'Labels') ? 'default' : 'active'}>{this.state.labelText}</span><img className='dropdownImg' src={dropdown} alt="arrow" /></div>{this.state.showLabelMenu ?
                  <div style={listboxStyleLabel} >{this.menuItems(labelObj)}</div> : null}</div>
                : null}
              {groupModeToggleFlag === true && toolbarMode.groupMode !== 'SELECTED' ? <span style={{ position: 'fixed', right: '50%', fontFamily: 'Open Sans', fontSize: '16px', color: '#252525' }}>Select notes to group</span>
                : null}

              {groupModeToggleFlag === true && toolbarMode.groupMode === 'SELECTED' && toolbarMode.selectedCount === 1 ? <span style={{ position: 'fixed', right: '50%', fontFamily: 'Open Sans', fontSize: '16px', color: '#252525' }}>{toolbarMode.selectedCount} note selected</span>
                : null}

              {groupModeToggleFlag === true && toolbarMode.groupMode === 'SELECTED' && toolbarMode.selectedCount > 1 ? <span style={{ position: 'fixed', right: '50%', fontFamily: 'Open Sans', fontSize: '16px', color: '#252525' }}>{toolbarMode.selectedCount} notes selected</span>
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
              />
                <span style={{ paddingRight: '50px' }}></span></div> : null}


              {groupModeToggleFlag === false ? <div>
                <table>
                  <tr>
                    <td style={{ paddingTop: '5px' }}><img src={layerPng} height='19px' width='18px' onClick={() => this.handleGroupNotesButton()} />
                    </td>
                    <td ><a onClick={() => this.handleGroupNotesButton()} style={{ fontSize: '14px', color: '#6a7070', fontWeight: '600', paddingLeft: '6px' }}>Group notes</a></td></tr></table></div>
                : null}
              {groupModeToggleFlag === true ? <RaisedButton label="Cancel" labelStyle={{ textTransform: 'capitalize', fontWeight: '600', color: '#252525' }} style={{ boxShadow: 'none' }} buttonStyle={buttonCancelStyle} onClick={() => this.handleCancelButton()} />
                : null}

              {toolbarMode.groupMode === 'SELECTED' && !this.state.showGroupTitleInput ? <RaisedButton label="New Group" style={{ float: 'right' }} onClick={() => this.handleNewGroupButton()} />
                : null}
              {this.state.showGroupTitleInput === true ? <RaisedButton label="Save" onClick={() => this.handleGroupSaveButton(event)} />
                : null}


              {groupModeToggleFlag === true && toolbarMode.groupMode === 'SELECTED' ? <RaisedButton label="Add to group" icon={<img className='dropdownImg' src={dropdown} alt="arrow" />} labelPosition="before" labelStyle={{ textTransform: 'capitalize', fontWeight: '600', color: '#252525' }} style={{ boxShadow: 'none' }} buttonStyle={buttonAddToGroupStyle} onClick={() => this.handleAddToGroupButton()} />
                : null}
              {groupModeToggleFlag === true && this.state.groupModeDrop === true ?
                <Paper style={{ position: 'absolute', top: '65px', left: '207px' }}>
                  <Menu onChange={this.handleGroupDropDownMenu}>
                    {toolbarMode.groups.map((group, index) =>
                      <MenuItemMaterial key={index} value={group.tags[0].tagId} primaryText={group.tags[0].tagName} />
                    )}
                  </Menu>
                </Paper> : null}



            </ToolbarGroup>
          </Toolbar>
          :
          <Toolbar style={{ height: '90px', position: 'fixed', width: '100%', 'zIndex': '1' }}>
            <ToolbarGroup style={{ paddingLeft: '70px' }}>
              <FontIcon className="muidocs-icon-custom-sort" />
              {groupModeToggleFlag === false ? <div className='all' onClick={() => this.handleGoToNotes()}>Notes</div>
                : null}
              {groupModeToggleFlag === false ? <ToolbarSeparator style={{ margin: '0 15px 0 10px' }} />
                : null}
              {groupModeToggleFlag === false ? <div> <div className='all filterLabel'><span><strong>{this.props.expandedTagName}</strong></span></div>  {this.state.showChapterMenu ?
                <div style={listboxStyle} >{this.menuItems(this.props.tocData.items)}</div> : null}</div>
                : null}
            </ToolbarGroup>
          </Toolbar>
        }
        <br />
      </div>
    );
  }
}

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
    borderColor: '#6a7070',
  },
  floatingLabelStyle: {
    color: orange500,
  },
  floatingLabelFocusStyle: {
    color: blue500,
  }
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
  width: '140px'
};



const listStyle = {
  padding: '10px'
};
const listboxStyle = {
  padding: '10px',
  background: '#fff',
  position: 'absolute',
  top: '75px',
  minWidth: '300px',
  overflowY: 'auto',
  boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.3)'
};
const listboxStyleLabel = {
  padding: '10px',
  background: '#fff',
  position: 'absolute',
  top: '75px',
  minWidth: '239px',
  boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.3)'
};
const chkBoxiconStyle = {
  fill: 'gray'
};
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
    this.handleGroupDropDownMenu = this.handleGroupDropDownMenu.bind(this);
    this.handleGroupNotesButton = this.handleGroupNotesButton.bind(this);
    this.handleNewGroupButton = this.handleNewGroupButton.bind(this);
    this.handleCancelButton = this.handleCancelButton.bind(this);
    this.handleAddToGroupButton = this.handleAddToGroupButton.bind(this);
    // const lists = [...props.lists];
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
      groupModeDrop: false,
      groupNoteShow : true
    };

    const labelAllObj = {
      'id': 'All',
      'title': 'All Labels',
      'labelName': 'All Chapters'
    };
    (this.props.tocData.items).unshift(labelAllObj);


  }

  componentDidMount = () => {
    window.addEventListener('click', this.domClick, false);
    this.getSelectedVal(this.props.lastUsedFilters ? this.props.lastUsedFilters : {});
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
    const localFilterVal = JSON.parse(localStorage.getItem('lastUsedFilters'));
    if (getVal === 'chapter') {
      const toggledIsOpen = this.state.showChapterMenu ? false : true;
      this.setState({ showChapterMenu: toggledIsOpen, showLabelMenu: false }, () => {
        let node = ReactDOM.findDOMNode(this.refs['listBox']);
        node.style.maxHeight = (window.innerHeight - 120) + 'px';
        if(localFilterVal.chapterId){
          this.makeCheckboxAschecked(localFilterVal.chapterId);
        }
        
      });
    }
    else if (getVal === 'label') {
      const toggledIsOpen = this.state.showLabelMenu ? false : true;
      this.setState({ showLabelMenu: toggledIsOpen, showChapterMenu: false }, () => {
        if(localFilterVal.noteType){
          this.makeCheckboxAschecked(localFilterVal.noteType);
        }
      });
      
    }
    else {
      this.setState({ showChapterMenu: false, showLabelMenu: false, chapterText: 'Chapter', labelText: 'Labels' });
      const filterArray = localStorage.setItem('lastUsedFilters', '');
      this.setState({ groupNoteShow : true});
      this.getSelectedVal({'lastUsedFilters' : filterArray});
    }

  }
  
  makeCheckboxAschecked = (getCheckedVal) => {
    if ( (getCheckedVal != null && (getCheckedVal.length > 0))) {
      _.each(getCheckedVal , function(val, index){
        if ( document.getElementById(val) ) {
          document.getElementById(val).checked = true;
        }
      });
    }
  }

  getSelectedVal = (props) => {
    const filterArr = props;
    localStorage.setItem("lastUsedFilters", JSON.stringify(props));
    const selectedChapter = filterArr.chapterId ? filterArr.chapterId : [];
    const selectedLabel = filterArr.noteType ? filterArr.noteType : [];
    var tocLevel = this.props.tocData.items;
    let updateChapterTxt = selectedChapter.length > 0 ? 'Chapter' + ' ' + selectedChapter.length : 'Chapter';
    let updateLabelTxt = selectedLabel.length > 0 ? selectedLabel.length + ' ' + 'Labels' : 'Labels';
    this.setState({ chapterText: updateChapterTxt, labelText: updateLabelTxt });
    const tocListItem = [];
    _.each(selectedChapter, (chapterId) => {
      tocLevel.find((toc) => {
        if (toc.id === chapterId) {
          tocListItem.push(toc);
        }
      });
    });

    let chapterList = [];
    let finalFilteredList = [];
    const note = this.props.notesList;
    _.each(tocListItem, (toc) => {
       if (typeof toc.items !== 'undefined' && toc.items.length > 0) {
      _.each(toc.items, (tocList) => {
          note.find((note) => {
          if (tocList.id === note.pageId) {
            chapterList.push(note);
          }
          if (typeof tocList.items !== 'undefined' && tocList.items.length > 0) {
            _.each(tocList.items, (secItem) => {
              if (secItem.id === note.pageId) {
                chapterList.push(note);
              }
            });
          }
        });
      });
      }
    });

    const checkChapterList = chapterList.length;
    if (checkChapterList > 0) {
      if (selectedLabel.length > 0) {
        _.each(chapterList, (chapterLis) => {
          selectedLabel.find((label) => {
            if ((chapterLis.noteType === label && !chapterLis.tags) || (label === 'NL' && !chapterLis.noteType)) {
              finalFilteredList.push(chapterLis);
            }
          });
        });
      }
      else {
        finalFilteredList = chapterList;
      }

    }
    else {
      _.each(note, (note) => {
          selectedLabel.find((label) => {
          if ((note.noteType === label && !note.tags) || (label === 'NL' && !note.noteType)) {
            finalFilteredList.push(note);
          }
        });
      });
    }
    this.props.getFilterArr(finalFilteredList);
    if (selectedChapter.length > 0 || selectedLabel.length > 0) {
      this.setState({ groupNoteShow : false});
    }
    else {
      this.setState({ groupNoteShow : true});
    }
  }

  handleCancelButton(event) {
    groupModeToggleFlag = !groupModeToggleFlag;
    this.setState({ showGroupTitleInput: false, groupTitle: '', groupId: null, groupModeDrop: false });
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
    this.props.callback('EDITGROUP', toolbarMode);
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
        'labelName': 'Main ideas',
        'labelCode': 'MAIN_IDEAS',
        'id': 'main_ideas'
      },
      {
        'labelName': 'From Instructor',
        'labelCode': 'FROM_INSTRUCTOR',
        'id': 'from_instructor'
      },
      {
        'labelName': 'Observations',
        'labelCode': 'OBSERVATIONS',
        'id': 'observations'
      },
      {
        'labelName': 'Questions',
        'labelCode': 'QUESTIONS',
        'id': 'questions'
      },
      {
        'labelName': 'No Label',
        'labelCode': 'CUSTOM_NOTE',
        'id': 'custom_notes'
      }
    ];

    return (
      <div>

        {this.props.groupExpanded === false ?
          <Toolbar className={(groupModeToggleFlag === true) ? 'groupSelect' : null} style={{ height: '80px', position: 'fixed', width: '100%', zIndex: '1001', backgroundColor: '#f5f5f5' }}>
            <ToolbarGroup>
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
                <div style={listboxStyle} ref='listBox'>{this.menuItems(this.props.tocData.items)}</div> : null}</div>
                : null}
              {groupModeToggleFlag === false ? <div><div className='all filterLabel' onClick={() => this.handleChange('label')}><span className={
                (this.state.labelText === 'Labels') ? 'default' : 'active'}>{this.state.labelText}</span><img className='dropdownImg' src={dropdown} alt="arrow" /></div>{this.state.showLabelMenu ?
                  <div style={listboxStyleLabel} >{this.menuItems(labelObj)}</div> : null}</div>
                : null}
              {groupModeToggleFlag === true && toolbarMode.groupMode !== 'SELECTED' ? <span style={{ position: 'fixed', right: '50%', fontFamily: 'Open Sans', fontSize: '16px', color: '#252525' }}>Select notes to group</span>
                : null}

              {groupModeToggleFlag === true && toolbarMode.groupMode === 'SELECTED' && toolbarMode.selectedCount === 1 && !this.state.showGroupTitleInput ? <span style={{ position: 'fixed', right: '50%', fontFamily: 'Open Sans', fontSize: '16px', color: '#252525' }}>{toolbarMode.selectedCount} note selected</span>
                : null}

              {groupModeToggleFlag === true && toolbarMode.groupMode === 'SELECTED' && toolbarMode.selectedCount > 1 && !this.state.showGroupTitleInput ? <span style={{ position: 'fixed', right: '50%', fontFamily: 'Open Sans', fontSize: '16px', color: '#252525' }}>{toolbarMode.selectedCount} notes selected</span>
                : null}

            </ToolbarGroup>
            <ToolbarGroup>
              <FontIcon className="muidocs-icon-custom-sort" />
              {this.state.showGroupTitleInput === true ? <div><TextField
                onChange={(e) => { this.handleGroupTitleChange(e); }}
                // value={this.state.groupTitle}
                style={{ marginBottom: '10px', fontSize:'14px' }}
                floatingLabelText="Group title"
                floatingLabelFocusStyle={{color:'#6a7070'}}
                floatingLabelStyle={{color:'#6a7070'}}
                defaultValue="Untitled group"
                underlineStyle={styles.underlineStyle}
                underlineFocusStyle={{borderBottom:'4px solid #047a9c'}}
              />
                <span style={{ paddingRight: '50px' }}></span></div> : null}


              {groupModeToggleFlag === false ? <div>
                {this.state.groupNoteShow ? <table>
                  <tr>
                    <td style={{ paddingTop: '5px' }}><img src={layerPng} height='19px' width='18px' onClick={() => this.handleGroupNotesButton()} />
                    </td>
                    <td ><a onClick={() => this.handleGroupNotesButton()} style={{ fontSize: '14px', color: '#6a7070', fontWeight: '600', paddingLeft: '6px' }}>Group notes</a></td></tr></table> : ''}</div>
                : null}
              {groupModeToggleFlag === true ? <RaisedButton label="Cancel" labelStyle={{ textTransform: 'capitalize', fontWeight: '600', color: '#252525', fontFamily:'Open Sans', fontSize:'14px', lineHheight: '1.29' }} style={{ boxShadow: 'none' }} buttonStyle={buttonCancelStyle} onClick={() => this.handleCancelButton()} />
                : null}

              {groupModeToggleFlag === true && toolbarMode.groupMode === 'SELECTED' ? <RaisedButton label="Add to group" icon={<img className='dropdownImg' src={dropdown} alt="arrow" />} labelPosition="before" labelStyle={{ textTransform: 'capitalize', fontWeight: '600', color: '#252525', fontFamily:'Open Sans', fontSize:'14px', lineHheight: '1.29' }} style={{ boxShadow: 'none' }} buttonStyle={buttonAddToGroupStyle} onClick={() => this.handleAddToGroupButton()} />
                : null}
              {groupModeToggleFlag === true && this.state.groupModeDrop === true ?
                <Paper style={{ position: 'absolute', top: '65px', left: '207px' }}>
                  <Menu onChange={this.handleGroupDropDownMenu}>
                    {this.props.tagAttributes.map((group, index) =>
                      <MenuItemMaterial key={index} value={group.tagId ? group.tagId : null} primaryText={group.tagName ? group.tagName : null} />
                    )}
                  </Menu>
                </Paper> : null}


              {toolbarMode.groupMode === 'SELECTED' && !this.state.showGroupTitleInput ? <RaisedButton label="New Group" buttonStyle= {{height: '36px', borderRadius: '2px', backgroundColor: '#047a9c', padding:'9px 16px', width:'110px'}} style={{backgroundColor: '#047a9c', height: '36px'}} labelStyle={{ float: 'right', textTransform: 'capitalize', color: '#ffffff', backgroundColor: '#047a9c', fontWeight: '600', fontFamily:'Open Sans', fontSize:'14px', lineHheight: '1.29', padding: '0'}} onClick={() => this.handleNewGroupButton()} />
                : null}
              {this.state.showGroupTitleInput === true ? <RaisedButton label="Save" labelStyle={{ textTransform: 'capitalize', fontWeight: '600', fontFamily:'Open Sans', color: '#ffffff',  fontSize:'14px', lineHheight: '1.29', height:'18px', padding: '9px 0'  }} buttonStyle={{backgroundColor: '#047a9c', width:'110px'}} onClick={() => this.handleGroupSaveButton(event)} />
                : null}


              


            </ToolbarGroup>
          </Toolbar>
          :
          <Toolbar style={{ height: '80px', position: 'fixed', width: '100%', 'zIndex': '1001', backgroundColor: '#f5f5f5' }}>
            <ToolbarGroup>
              <FontIcon className="muidocs-icon-custom-sort" />
              {groupModeToggleFlag === false ? <div className='all' onClick={() => this.handleGoToNotes()}>Notes</div>
                : null}
              {groupModeToggleFlag === false ? <ToolbarSeparator style={{ color: '#e7e7e7', width: '2px', margin: '0px 22px 0px 18px', height: '20px' }} />
                : null}
              {groupModeToggleFlag === false ? <div> <div className='all filterLabel groupnotes'><span><strong>{this.props.expandedTagName}</strong></span></div>  {this.state.showChapterMenu ?
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

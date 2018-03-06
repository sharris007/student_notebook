import React, { Component, PropTypes } from 'react';
import '../assets/temp.styl';
import RaisedButton from 'material-ui/RaisedButton';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import FontIcon from 'material-ui/FontIcon';
import TextField from 'material-ui/TextField';
import { orange500, blue500 } from 'material-ui/styles/colors';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Checkbox from 'material-ui/Checkbox';
import '../scss/notebook.scss';
import MenuItem from './menuItem';

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



const listStyle = {
  padding : '10px'
}
const listboxStyle = {
  border : '1px solid gray',
  padding:'10px 50px 10px 10px',
  background: '#fff',
  position: 'absolute',
  top: '48px'
}
const chkBoxiconStyle = {
  fill: 'gray'
}
let groupModeToggleFlag = false;


export default class NoteBookHeader extends Component {
  static propTypes = {
    callback: PropTypes.func,
    toolbarMode: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.handleOnChange = this.handleOnChange.bind(this);
 this.menuItems = this.menuItems.bind(this);
    this.handleGroupSaveButton = this.handleGroupSaveButton.bind(this);
    this.handleGroupNotesButton = this.handleGroupNotesButton.bind(this);
    this.handleNewGroupButton = this.handleNewGroupButton.bind(this);
    this.handleCancelButton = this.handleCancelButton.bind(this);
    // const lists = [...props.lists];
    
    this.state = {
      isScrolling: false,
      search: '',
      ider: null,
  	  values: [],
      showChapterMenu : false,
      showLabelMenu : false,
      menuBarClass: 'test',
      showGroupInputTitle: false,
      toolbarMode: props.toolbarMode,
      groupTitle: ''
    };

    const labelAllObj = {"id": "All",
         "title": "All Labels",
         "labelName": 'All'};
          (this.props.tocData.content.list).unshift(labelAllObj);

    
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
    if(getVal === 'chapter') {
      const toggledIsOpen = this.state.showChapterMenu ? false : true;
      this.setState({showChapterMenu : toggledIsOpen, showLabelMenu : false});
    }
    else{
      const toggledIsOpen = this.state.showLabelMenu ? false : true;
      this.setState({showLabelMenu : toggledIsOpen , showChapterMenu : false});
    }
      
  }
  getSelectedVal = (val) => {
    const props = this.props;
    const selectedChapter = JSON.parse(localStorage.getItem("chapterItem"));
    const selectedLabel = JSON.parse(localStorage.getItem("labelItem"));
    var tocLevel = props.tocData.content.list
    const tocListItem = [];
    for (let i=0; i<selectedChapter.length;i++) {
      tocLevel.find((toc) => {
        if( toc.id === selectedChapter[i]) 
          { 
            tocListItem.push(toc); 
          } 
      });
    }


    let chapterList = [];
    let finalFilteredList = [];
    const note = props.notesList
    for (let i1=0;i1<tocListItem.length;i1++) {
      if (typeof tocListItem[i1].children !== 'undefined' && tocListItem[i1].children.length > 0) {
        for (let j1=0;j1<tocListItem[i1].children.length;j1++) {
          note.find((note) => {
            if( tocListItem[i1].children[j1].id === note.pageId) 
              { 
                chapterList.push(note) 
              } 
          });
        }
      }
    }
    for (let c=0;c<chapterList.length;c++) {
      selectedLabel.find((label) => {
        if( chapterList[c].noteText === label) 
          { 
            finalFilteredList.push(chapterList[c]) 
          } 
      });
    }
    // chapterList = chapterList.length > 0 ? chapterList : props.notesList;
    if(finalFilteredList.length > 0 ){
      this.props.getFilterArr(finalFilteredList);
    }
    else{
      this.props.getFilterArr(chapterList);
    }
    
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

  menuItems = (values, fun) => {
    return values.map((val) => (
      <MenuItem content={val} label={val.labelName ? val.labelName : val.title} labelCode={val.labelCode?val.labelCode:''} getSelectedVal={this.getSelectedVal} />
    ));
  }
   handleGroupTitleChange(e) {
    let toolbarMode = this.state.toolbarMode;
    toolbarMode.groupTitle = e.target.value;
    this.setState({ groupTitle: e.target.value, toolbarMode });
  }


  render() {
    const { toolbarMode } = this.state;
    const labelObj = [
            {
              "labelName": "All Labels",
              "labelCode": "all-label",
              "id":"all-label"
            },
            {
              "labelName": "From Instructor",
              "labelCode": "I",
              "id":"from_instructor"
            },
            {
              "labelName": "Observations",
              "labelCode": "O",
              "id":"observations"
            },
            {
              "labelName": "Questions",
              "labelCode": "Q",
              "id":"questions"
            },
            {
              "labelName": "Main ideas",
              "labelCode": "M",
              "id":"main_ideas"
            }
          ];
          
    return (



      <div style={{ marginLeft: '-180px' }}>
    
    
          
        <Toolbar style={{ height: '90px' }}>
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


        
      </div>
    );
  }
}

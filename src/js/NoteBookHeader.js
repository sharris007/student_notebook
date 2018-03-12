import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import '../assets/temp.styl';
import RaisedButton from 'material-ui/RaisedButton';
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
  padding:'10px',
  background: '#fff',
  position: 'absolute',
  top: '75px',
  minWidth: '300px'
}
const listboxStyleLabel = {
  border : '1px solid gray',
  padding:'10px',
  background: '#fff',
  position: 'absolute',
  top: '75px',
  minWidth: '280px'
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
      chapterText: 'Chapter',
      labelText: 'Labels',
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

  componentDidMount = () => {
     window.addEventListener('click', this.domClick, false);
  }

  domClick = (e) => {
    if (!ReactDOM.findDOMNode(this).contains(e.target)) {
      this.setState({
          showChapterMenu : false , showLabelMenu : false
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
    if(getVal === 'chapter') {
      const toggledIsOpen = this.state.showChapterMenu ? false : true;
      this.setState({showChapterMenu : toggledIsOpen, showLabelMenu : false});
    }
    else if( getVal === 'label'){
      const toggledIsOpen = this.state.showLabelMenu ? false : true;
      this.setState({showLabelMenu : toggledIsOpen , showChapterMenu : false});
    }
    else{
      this.setState({showChapterMenu : false , showLabelMenu : false, chapterText : 'Chapter', labelText : 'Labels'});
      localStorage.setItem('labelItem', JSON.stringify([]));
      localStorage.setItem('chapterItem', JSON.stringify([]));
      this.getSelectedVal();
    }
      
  }
  getSelectedVal = () => {
    const props = this.props;
    const selectedChapter = JSON.parse(localStorage.getItem("chapterItem")) ? JSON.parse(localStorage.getItem("chapterItem")) : [];
    const selectedLabel = JSON.parse(localStorage.getItem("labelItem")) ? JSON.parse(localStorage.getItem("labelItem")) : [];
    var tocLevel = props.tocData.content.list;
    let updateChapterTxt = selectedChapter.length > 0 ? "Chapter" + ' ' +selectedChapter.length :'Chapter';
    let updateLabelTxt = selectedLabel.length > 0 ? selectedLabel.length+' '+ "Labels" : 'Labels';
    this.setState( { chapterText : updateChapterTxt, labelText : updateLabelTxt});
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
    const note = props.notesList;
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
    const checkChapterList = chapterList.length;
    if (checkChapterList > 0) { 
      if (selectedLabel.length > 0) { 
        for (let c=0;c<chapterList.length;c++) {
          selectedLabel.find((label) => {
            if ( chapterList[c].noteText === label||(label==='NL' && !chapterList[c].noteText) )
              { 
                finalFilteredList.push(chapterList[c]);
              } 
          });
        }
      }
      else {
        finalFilteredList = chapterList; 
      }
      
    }
    else{
      for (let c=0;c<note.length;c++) {
        selectedLabel.find((label) => {
          if( note[c].noteText === label || (label==='NL' && !note[c].noteText)) 
            { 
              finalFilteredList.push(note[c]); 
            } 
        });
      }
    }
    this.props.getFilterArr(finalFilteredList);
    
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
    
    
          
        <Toolbar style={{ height: '90px', position: 'fixed', width: '100%', 'zIndex': '1' }}>
          <ToolbarGroup style={{paddingLeft : '70px'}}>
            <FontIcon className="muidocs-icon-custom-sort" />
            {groupModeToggleFlag === false ? <div className='all' onClick={() => this.handleChange('all')}>All</div>
              : null}
            {groupModeToggleFlag === false ? <ToolbarSeparator style={{ margin: '0 15px 0 10px'}}/>
              : null}
            {groupModeToggleFlag === false ?<div> <div className='all filterLabel' onClick={() => this.handleChange('chapter')}><span className={
              (this.state.chapterText === 'Chapter') ? 'default' : 'active'
            }>{this.state.chapterText}</span><img className='dropdownImg' src={dropdown} alt="arrow"/> </div>  {this.state.showChapterMenu ?
              <div style={listboxStyle} >{this.menuItems(this.props.tocData.content.list)}</div> : null }</div>
              : null}
              

            {groupModeToggleFlag === false ? <div><div className='all filterLabel' onClick={() => this.handleChange('label')}><span className={
              (this.state.labelText === 'Labels') ? 'default' : 'active'}>{this.state.labelText}</span><img className='dropdownImg' src={dropdown} alt="arrow"/></div>{this.state.showLabelMenu ?
              <div style={listboxStyleLabel} >{this.menuItems(labelObj)}</div> : null }</div>
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

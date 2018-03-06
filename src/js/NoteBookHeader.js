import React, { Component, PropTypes } from 'react';
import '../assets/temp.styl';
import '../scss/notebook.scss';
import MenuItem from './menuItem';

const VerticalLine = () => (
  <div style={{ float: 'left', borderLeft: '2px solid lightgrey', height: '40px', marginLeft: '10px', marginRight: '10px' }}></div>
);



const buttonAllStyle = {
  background: 'grey',
  borderRadius: '30px',
  fontSize: '12px',
  width: '75px',
  height: '40px',
  color: 'white'
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

const buttonGroupStyle = {
  float: 'right',
  background: 'white',
  borderColor: 'grey',
  borderWidth: '2px',
  borderRadius: '2px',
  fontSize: '15px',
  width: '100px',
  height: '40px',
  color: 'grey'
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


export default class NoteBookHeader extends Component {
  static propTypes = {
    callback: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.menuItems = this.menuItems.bind(this);
    // const lists = [...props.lists];
    
    this.state = {
      isScrolling: false,
      search: '',
      ider: null,
      values: [],
      showChapterMenu : false,
      showLabelMenu : false
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
 //   this.props.groupMode();
    this.props.callback('GROUP', true);
  //  this.setState({ search: event.target.value });
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

  menuItems = (values, fun) => {
    return values.map((val) => (
      <MenuItem content={val} label={val.labelName ? val.labelName : val.title} labelCode={val.labelCode?val.labelCode:''} getSelectedVal={this.getSelectedVal} />
    ));
  }
  
  
  render() {

    //const { lists } = this.state.values;

    // const filteredList = lists.filter(list => {
    //   list.cards = list.cards.filter(card => {
    //     if (card.title || card.title === '') {
    //       return (card.title.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1);
    //     }
    //   });

    //   return true;
    // });
    
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
      <div>
        <table>
          <tbody>
            <tr>
              <td>
                <button style={buttonAllStyle}>All</button>
              </td>
              <td>
                <VerticalLine></VerticalLine>
              </td>
              <td>
              <button style={buttonStyles} onClick={() => this.handleChange('chapter')}>Chapter</button>
              {this.state.showChapterMenu ?
              <div style={listboxStyle} >{this.menuItems(this.props.tocData.content.list)}</div> : null }
                
              </td>
              <td>
                <button style={buttonStyles} onClick={() => this.handleChange('label')}>Labels</button>
                {this.state.showLabelMenu ?
              <div style={listboxStyle} >{this.menuItems(labelObj)}</div> : null }
              </td>
              <td style={{ width: '68%' }}>
                <button style={buttonGroupStyle} onClick={() => this.handleGroupNotesButton()}>Group notes</button>
              </td>
            </tr>
          </tbody>

        </table>


        
      </div>
    );
  }
}

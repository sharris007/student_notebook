import React, { Component, PropTypes } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import CardsContainer from './Cards/CardsContainer';
import CustomDragLayer from './CustomDragLayer';
import NoteBookHeader from './NoteBookHeader';


import '../assets/temp.styl';

@DragDropContext(HTML5Backend)  // eslint-disable-line
export default class Board extends Component {
  static propTypes = {
    notesList: PropTypes.array.isRequired,
    groupModeFlag: PropTypes.bool,
    callback: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.moveCard = this.moveCard.bind(this);
    this.moveList = this.moveList.bind(this);
    this.findList = this.findList.bind(this);
    this.scrollRight = this.scrollRight.bind(this);
    this.scrollLeft = this.scrollLeft.bind(this);
    this.stopScrolling = this.stopScrolling.bind(this);
    this.startScrolling = this.startScrolling.bind(this);
    this.addCard = this.addCard.bind(this);
    this.cancelAddCard = this.cancelAddCard.bind(this);
    this.saveCard = this.saveCard.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.getFilterArr = this.getFilterArr.bind(this);
    // const lists = [...props.lists];
    console.log("nextProps1", props.notesList);
    const notesList = [...props.notesList];


    if (props.groupModeFlag === false) {
      notesList.splice(0, 0, {
        id: 'new',
        keyId: Date.now(),
        cardFormat: 'add mode',
        title: '',
        content: '',
        content2: '',
        changeDate: ''
      });
    }

    const lists = [];
    // initialize lists
    for (let ic = 0; ic < props.coloums; ic++) {
      lists.push({
        id: ic,
        cards: []
      });
    }

    notesList.map((item, i) => {
      const index = i % props.coloums;
      if (!item.cardFormat) {
        item.cardFormat = 'note';
      }
      item.keyId = item.id + Date.now();
      lists[index].cards.push(item);
    });


    this.state = {
      isScrolling: false,
      search: '',
      lists: [],
      notesList: notesList,
      ider: null,
      groupModeFlag: props.groupModeFlag
    };

  }
  createLists = (nextProps, cardDropped) => {
    console.log("nextProps", nextProps.notesList);
    const notesList = [...nextProps.notesList];
    if (!cardDropped || nextProps.groupModeFlag === false) {
      notesList.splice(0, 0, {
        id: 'new',
        keyId: notesList.length + Date.now(),
        title: '',
        cardFormat: 'add mode',
        content: '',
        content2: '',
        changeDate: ''
      });
    }

    const lists = [];
    // initialize lists
    for (let ic = 0; ic < nextProps.coloums; ic++) {
      lists.push({
        id: ic,
        cards: []
      });
    }
    notesList.map((item, i) => {
      const index = i % nextProps.coloums;
      if (!item.cardFormat) {
        item.cardFormat = 'note';
      }
      lists[index].cards.push(item);
    });
    this.setState({lists,  groupModeFlag: nextProps.groupModeFlag}, ()=>{
      const nextLists = {notesList:[], coloums:nextProps.coloums};
      const newLists = [...this.state.lists];
      newLists.forEach((list, listIndex) =>{
        list.cards.forEach((card, cardIndex)=>{
          const index = (nextProps.coloums*cardIndex)+listIndex;
          nextLists.notesList.splice(index, 0, card);
        });
      });
    });
  }
  componentWillMount() {
    this.createLists(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ groupModeFlag: nextProps.groupModeFlag });
    this.createLists(nextProps);
  }


  startScrolling(direction) {
    switch (direction) {
      case 'toLeft':
        this.setState({ isScrolling: true }, this.scrollLeft());
        break;
      case 'toRight':
        this.setState({ isScrolling: true }, this.scrollRight());
        break;
      default:
        break;
    }
  }

  scrollRight() {
    function scroll() {
      document.getElementsByTagName('main')[0].scrollLeft += 10;
    }
    this.scrollInterval = setInterval(scroll, 10);
  }

  scrollLeft() {
    function scroll() {
      document.getElementsByTagName('main')[0].scrollLeft -= 10;
    }
    this.scrollInterval = setInterval(scroll, 10);
  }

  stopScrolling() {
    this.setState({ isScrolling: false }, clearInterval(this.scrollInterval));
  }

  moveCard(lastX, lastY, nextX, nextY) {
    const newLists = [...this.state.lists];

    if (!!newLists[nextX].cards[nextY]) {
      if (newLists[nextX].cards[nextY].colorCode === 'GROUP') {


        let txt;
        let r = confirm("Add to group " + newLists[nextX].cards[nextY].quote);
        if (r == true) {
          txt = "You pressed OK!";
          newLists[lastX].cards.splice(lastY, 1)[0]
          this.setState({ lists: newLists });
          return;
        }

      }
    }

    if (lastX === nextX) {
      newLists[lastX].cards.splice(
        nextY,
        0,
        newLists[lastX].cards.splice(lastY, 1)[0]
      );
    } else {
      // move element to new place
      newLists[nextX].cards.splice(nextY, 0, newLists[lastX].cards[lastY]);
      // delete element from old place
      newLists[lastX].cards.splice(lastY, 1);
    }*/
    // this.setState({ lists: newLists });
    const nextLists = {notesList:[], coloums:this.props.coloums};
    newLists.forEach((list, listIndex) =>{
      list.cards.forEach((card, cardIndex)=>{
        const index = (this.props.coloums*cardIndex)+listIndex;
        nextLists.notesList.splice(index, 0, card);
      });
    });
    const dragCardIndex = (this.props.coloums*lastY)+lastX;
    // const dragCard = nextLists.notesList.splice(dragCardIndex, 1);
    const dropCardIndex = (this.props.coloums*nextY)+nextX;
    nextLists.notesList.splice(dropCardIndex, 0, nextLists.notesList.splice(dragCardIndex, 1)[0]);
    this.createLists(nextLists, true);
  }

  moveList(listId, nextX) {
    const { lastX } = this.findList(listId);
    //this.props.moveList(lastX, nextX);
    const newLists = [...this.state.lists];
    const t = newLists.splice(lastX, 1)[0];

    newLists.splice(nextX, 0, t);
    this.setState({ lists: newLists });
  }

  findList(id) {
    const { lists } = this.state;
    const list = lists.filter(l => l.id === id)[0];

    return {
      list,
      lastX: lists.indexOf(list)
    };
  }

  addCard() {
    //this.props.addCard();
    const newLists = [...this.state.lists];

    newLists[0].cards[0] = {
      id: '',
      keyId: Date.now(),
      title: '',
      cardFormat: 'create new',
      content: '',
      content2: '',
      changeDate: new Date()
    };

    this.setState({ lists: newLists });
  }

  cancelAddCard() {
    const newLists = [...this.state.lists];
    newLists[0].cards[0] = {
      id: 0,
      title: '',
      keyId: newLists.length + Date.now(),
      cardFormat: 'add mode',
      content: '',
      content2: '',
      changeDate: 'January 11, 1977'
    };

    this.setState({ lists: newLists });
  }

  saveCard(newNote, msg) {
    if (msg === 'ADD') {
      newNote.id = '';
    }
    this.props.callback(msg, newNote);
  }


  handleOnChange(event) {
    this.props.getLists(6);
    this.setState({ search: event.target.value });
  }

  getFilterArr(list){
    const notesList = {};
    notesList.coloums = this.props.coloums;
    if(JSON.parse(localStorage.getItem('chapterItem')).length > 0 || JSON.parse(localStorage.getItem('chapterItem')).length > 0){
      notesList.notesList = list;
    }
    else{
      notesList.notesList = this.props.notesList;
    }
    this.createLists(notesList);
  }

  render() {
    const { lists } = this.state;
    const filteredList = lists.filter(list => {
      list.cards = list.cards.filter(card => {
        if (card.title || card.title === '') {
          return (card.title.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1);
        }

      });
      return true;
    });
    return (
      <div>
      <NoteBookHeader getFilterArr={this.getFilterArr} callback={this.callback} tocData={this.props.tocData} notesList={this.props.notesList}></NoteBookHeader>
      <main>
        <div style={{ height: '100%' }}>
          <CustomDragLayer snapToGrid={false} />
          {filteredList.map((item, i) => (
            <CardsContainer
              key={item.keyId}
              id={item.id}
              item={item}
              moveCard={this.moveCard}
              moveList={this.moveList}
              startScrolling={this.startScrolling}
              stopScrolling={this.stopScrolling}
              isScrolling={this.state.isScrolling}
              cancelAddCard={this.cancelAddCard}
              saveCard={this.saveCard}
              addCard={this.addCard}
              groupModeFlag={this.state.groupModeFlag}
              x={i}
            />
          ))}
        </div>
      </main>
      </div>
    );
  }
}

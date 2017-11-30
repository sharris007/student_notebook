import React, { Component, PropTypes } from "react";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

import CardsContainer from "./Cards/CardsContainer";
import CustomDragLayer from "./CustomDragLayer";

import "../assets/temp.styl";

@DragDropContext(HTML5Backend)
export default class Board extends Component {
  static propTypes = {
    lists: PropTypes.array.isRequired,
    notesList: PropTypes.array.isRequired,
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
    const lists = [...props.lists];
    const notesList = [...props.notesList];

    // lists[0].cards.unshift({
    //   id: 0,
    //   title: "",
    //   cardFormat: "add mode",
    //   content: "",
    //   content2: ""
    // });

    this.state = {
      isScrolling: false,
      search: "",
      lists: props.lists,
      notesList: props.notesList
    };
  }

  componentWillMount() {}

  componentWillReceiveProps() {}
  editCard(card) {
    console.log(card);
  }
  deleteCard(card) {
    console.log(card);
  }
  navigateCard(card) {
    console.log(card);
  }

  startScrolling(direction) {
    // if (!this.state.isScrolling) {
    switch (direction) {
      case "toLeft":
        this.setState({ isScrolling: true }, this.scrollLeft());
        break;
      case "toRight":
        this.setState({ isScrolling: true }, this.scrollRight());
        break;
      default:
        break;
    }
    // }
  }

  scrollRight() {
    function scroll() {
      document.getElementsByTagName("main")[0].scrollLeft += 10;
    }
    this.scrollInterval = setInterval(scroll, 10);
  }

  scrollLeft() {
    function scroll() {
      document.getElementsByTagName("main")[0].scrollLeft -= 10;
    }
    this.scrollInterval = setInterval(scroll, 10);
  }

  stopScrolling() {
    this.setState({ isScrolling: false }, clearInterval(this.scrollInterval));
  }

  moveCard(lastX, lastY, nextX, nextY) {
    //this.props.moveCard(lastX, lastY, nextX, nextY);
    const newLists = [...this.state.lists];
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
    }
    this.setState({ lists: newLists });
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
      id: "",
      title: "",
      cardFormat: "create new",
      content: "",
      content2: "",
      changeDate: new Date()
    };
    this.setState({ lists: newLists });
  }

  cancelAddCard() {
    const newLists = [...this.state.lists];
    newLists[0].cards[0] = {
      id: 0,
      title: "",
      cardFormat: "add mode",
      content: "",
      content2: "",
      changeDate: "January 11, 1977"
    };

    this.setState({ lists: newLists });
  }

  saveCard(newNote) {
    debugger;
    const newLists = [...this.state.lists];
    const notesList = [...this.state.notesList];
    // newLists[0].cards[0] = {
    //   id: 0,
    //   title: "",
    //   cardFormat: "add mode",
    //   content: "",
    //   content2: ""
    // };


    let lastId = notesList.reduce(function(max, x) {
      return x.id > max ? x.id : max;
    }, 0);

    notesList.splice(1, 0, {
      id: lastId + 1,
      firstName: "new",
      lastName: "ssssssbill",
      title: newNote.title,
      cardFormat: "note",
      content: "xxxxThe quick brown fox jumped over the lazy dog.",
      content2: "xxxxThe cubs are world series champions",
      wikiImage: "bxxxxill",
      changeDate: newNote.changeDate
    });

    lastId = notesList.reduce(function(max, x) {
      return x.id > max ? x.id : max;
    }, 0);

    notesList[0] = {
      id: lastId + 1,
      firstName: "",
      lastName: "",
      title: "",
      cardFormat: "add mode",
      content: "",
      content2: "",
      wikiImage: "",
      changeDate: ""
    };


    let lists = [];
    // initialize lists
    for (let ic = 0; ic < 5; ic++) {
      lists.push({
        id: ic,
        name: "",
        cards: []
      });
    }

    notesList.map((item, i) => {
      //    let index = i % quantity;
      let index = i % 5;
      lists[index].cards.push(item);
    });


    this.setState({ lists: lists, notesList: notesList }, () => {
      this.props.callback("ADD", newNote);
    });
  }

  handleOnChange(event) {
    this.props.getLists(6);
    this.setState({ search: event.target.value });
  }

  render() {
    const { lists } = this.state;

    const filteredList = lists.filter(list => {
      list.cards = list.cards.filter(card => {
        return (
          card.title.toLowerCase().indexOf(this.state.search.toLowerCase()) !==
          -1
        );
      });
      return true;
    });

    return (
      <main>
        <div style={{ height: "100%" }}>
          <CustomDragLayer snapToGrid={false} />{" "}
          {filteredList.map((item, i) => (
            <CardsContainer
              key={item.id}
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
              x={i}
            />
          ))}
        </div>
      </main>
    );
  }
}

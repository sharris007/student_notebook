import React, { Component, PropTypes } from 'react';
import { DropTarget } from 'react-dnd';
import { findDOMNode } from 'react-dom';

import Card from './DraggableCard';
import { CARD_HEIGHT, CARD_MARGIN, OFFSET_HEIGHT } from '../constants.js';

var xDirection = "";
var yDirection = "";

var oldX = 0;
var oldY = 0;
var bodyElement = document.querySelector("body");

function getPlaceholderIndex(y, scrollY) {
  // shift placeholder if y position more than card height / 2
  const yPos = y - OFFSET_HEIGHT + scrollY;
  let placeholderIndex;
  if (yPos < CARD_HEIGHT / 2) {
    placeholderIndex = -1; // place at the start
  } else {
    placeholderIndex = Math.floor((yPos - CARD_HEIGHT / 2) / (CARD_HEIGHT + CARD_MARGIN));
  }
  window.placeholderIndex = placeholderIndex;
  window.currentOffsety = yPos;
  return placeholderIndex;
}

function getPlaceholderDimensions(id, direction) {
  let item = document.getElementById(id);

  if (item) {
    if (direction === 'left') {
      window.lefter = item.offsetLeft - 20;
    } else {
      window.lefter = item.offsetLeft + 270;
    }
    window.topper = item.offsetTop;
    window.height = item.offsetHeight;
  }
}



const specs = {
  drop(props, monitor, component) {

    document.getElementById(monitor.getItem().id).style.display = 'block';

    const newStyle = { 'display': 'none', 'left': '0px' };

    newStyle.display = 'block';
    newStyle.left = monitor.getClientOffset().x - findDOMNode(component).getBoundingClientRect().left + 'px';

    const { placeholderIndex } = component.state;
    const { direction } = component.state;
    const lastX = monitor.getItem().x;
    const lastY = monitor.getItem().y;
    const nextX = props.x;
    let nextY = placeholderIndex;

    const droppedItem = monitor.getItem()

    if (window.saveItem === droppedItem.id) { // note didn't move out of place
      return;
    }


    if (lastY > nextY) { // move top
      nextY += 1;
    } else if (lastX !== nextX) { // insert into another list
      nextY += 1;
    }
    if (lastX === nextX && lastY === nextY) { // if position equel
      nextY += 1;
    }
    props.moveCard(lastX, lastY, nextX, nextY);


    // used for grouping over
    // save for later

    // if (window.cardId === null) {
    //   alert('MOVE null cardindex');
    // } else {
    //   const index = _.findIndex(window.cards, function (o) { return o.id === window.cardId });
    //   try {
    //     alert('DROP' + window.cards[index].id);
    //     props.saveGroup(window.cards[index].id, monitor.getItem().id);
    //   } catch (e) {
    //     alert('error' + window.cardId);
    //   }
    // }


    // if (component.props.item.item.color === "orange" || component.props.item.item.color === "blue" || component.props.item.item.color === "green") {
    //   console.log('transform-drop', `${nextX}px, ${nextY}px)`);
    // }


  },
  hover(props, monitor, component) {
    const nextX = props.x;
    const lastY = monitor.getItem().y;
    const lastX = monitor.getItem().x;
    let nextY = component.state.placeholderIndex;
    if (lastY > nextY) { // move top
      nextY += 1;
    } else if (lastX !== nextX) { // insert into another list
      nextY += 1;
    }

    var getSourceClientOffset = monitor.getSourceClientOffset().x;


    const hoverPosition = props.position;
    const newStyle = { 'display': 'none', 'left': '0px' };
    newStyle.display = 'block';

    newStyle.left = window.innerWidth - monitor.getClientOffset().x - findDOMNode(component).getBoundingClientRect().left + 'px';
    component.setState({ style: newStyle, nextX: nextX, nextY: nextY, direction: (monitor.getDifferenceFromInitialOffset().x <= 0) ? 'left' : 'right', positioning: getSourceClientOffset });

    // document.getElementById(monitor.getItem().id).style.left
    //The current mouse position where the "on hover indicator" is expected

    const placeholderIndex = getPlaceholderIndex(
      monitor.getClientOffset().y,
      findDOMNode(component).scrollTop
    );

    // horizontal scroll
    if (!props.isScrolling) {
      if (window.innerWidth - monitor.getClientOffset().x < 200) {
        props.startScrolling('toRight');
      } else if (monitor.getClientOffset().x < 200) {
        props.startScrolling('toLeft');
      }
    } else {
      if (window.innerWidth - monitor.getClientOffset().x > 200 &&
        monitor.getClientOffset().x > 200
      ) {
        props.stopScrolling();
      }
    }

    // IMPORTANT!
    // HACK! Since there is an open bug in react-dnd, making it impossible
    // to get the current client offset through the collect function as the
    // user moves the mouse, we do this awful hack and set the state (!!)
    // on the component from here outside the component.
    // https://github.com/gaearon/react-dnd/issues/179
    component.setState({ placeholderIndex });

    // when drag begins, we hide the card and only display cardDragPreview
    const item = monitor.getItem();
    document.getElementById(item.id).style.opacity = 0.5;
  }
};


@DropTarget('card', specs, (connectDragSource, monitor) => ({ // eslint-disable-line
  connectDropTarget: connectDragSource.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
  item: monitor.getItem(),
}))
export default class Cards extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    moveCard: PropTypes.func.isRequired,
    saveGroup: PropTypes.func.isRequired,
    cards: PropTypes.array.isRequired,
    x: PropTypes.number.isRequired,
    isOver: PropTypes.bool,
    item: PropTypes.object,
    canDrop: PropTypes.bool,
    startScrolling: PropTypes.func,
    stopScrolling: PropTypes.func,
    isScrolling: PropTypes.bool,
    cancelAddCard: PropTypes.func,
    saveCard: PropTypes.func,
    addCard: PropTypes.func,
    groupModeFlag: PropTypes.bool,
    groupExpanded: PropTypes.bool,
    handleGroupClick: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = {
      placeholderIndex: undefined,
      isScrolling: false,
      groupModeFlag: props.groupModeFlag,
      groupExpanded: props.groupExpanded,
      direction: 'left',
      verticalDirection: ' ',
      lastScrollPos: 0
    };

    this.handleScroll = this.handleScroll.bind(this);
  }

  handleScroll(event) {
    if (this.state.lastScrollPos > event.currentTarget.scrollTop) {
      this.setState({
        verticalDirection: 'top',
        lastScrollPos: event.currentTarget.scrollTop
      });
    } else if (this.state.lastScrollPos < event.currentTarget.scrollTop) {
      this.setState({
        verticalDirection: 'bottom',
        lastScrollPos: event.currentTarget.scrollTop
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ groupModeFlag: nextProps.groupModeFlag, groupExpanded: nextProps.groupExpanded });
  }

  render() {
    const { connectDropTarget, x, cards, isOver, canDrop } = this.props;
    const { placeholderIndex, groupModeFlag, groupExpanded, direction } = this.state;
    let isPlaceHold = false;
    let righter = false;
    const cardList = [];
    let skip = false;
    let isPlaced = false;
    window.placeholderIndex = null;
    window.saveItem = null;

    let filterList = _.cloneDeep(cards);
    filterList.forEach((item, i) => {



      let newKey = Date.now();
      item.color = 'white';
      item.marginLeft = '0px';
      item.marginRight = '0px';
      item.scale = '1';

      let colorr = 'white';



      if (isPlaced) {
        isPlaced = false;
        getPlaceholderDimensions(item.id, this.state.direction);
        if (this.state.direction == 'left') {
          item.marginLeft = '20px';
        } else {
          item.marginRight = '20px';
        }
        window.saveItem = item.id;
        cardList.push(<div style={{ background: '#047a9c', position: 'absolute', visibility: 'visible', top: window.topper, left: window.lefter, zIndex: 200, height: window.height }} className="item placeholder3" />);
      }


      if (isOver && canDrop && !isPlaced) {
        isPlaceHold = false;

        if (i === 0 && placeholderIndex === -1) { // top row
          window.placeholderIndex = placeholderIndex;

          getPlaceholderDimensions(item.id, this.state.direction);

          if (this.state.direction == 'left') {
            item.marginLeft = '20px';
            cardList.push(<div style={{ background: '#047a9c', position: 'absolute', visibility: 'visible', top: window.topper, left: window.lefter, zIndex: 200, height: window.height }} className="item placeholder3" />);
          } else {
            item.marginRight = '20px';
            cardList.push(<div style={{ background: '#047a9c', position: 'absolute', visibility: 'visible', top: window.topper, left: window.lefter, zIndex: '200', height: window.height }} className="item placeholder3" />);
          }
          window.saveItem = item.id;

        } else if (placeholderIndex > i) { // wait to indent next note not the current one in this loop
          isPlaceHold = true;
        }
      }

      if (righter) {
        isPlaceHold = false;
        window.placeholderIndex = placeholderIndex;
        getPlaceholderDimensions(item.id, this.state.direction);
        window.saveItem = item.id;

        item.marginRight = '20px';
        cardList.push(<div style={{ background: '#047a9c', position: 'absolute', visibility: 'visible', top: window.topper, left: window.lefter, zIndex: 200, height: window.height }} className="item placeholder3" />);
        righter = false;
      }

      isPlaced = false;

      if (item !== undefined) {
        let height = 'auto';

        cardList.push(

          <div key={item.keyId} style={{
            backgroundColor: colorr,
            marginLeft: item.marginLeft,
            marginRight: item.marginRight,
            height: `${height}`,
          }} onScroll={this.handleScroll}>

            <Card x={x} y={i}
              color={colorr}
              canDrag={item.cardFormat === 'note' ? true : false}
              item={item}
              key={item.keyId}
              stopScrolling={this.props.stopScrolling}
              cancelAddCard={this.props.cancelAddCard}
              saveCard={this.props.saveCard}
              addCard={this.props.addCard}
              groupModeFlag={groupModeFlag}
              groupExpanded={groupExpanded}
              handleGroupClick={this.props.handleGroupClick}
              groupExpanded={this.props.groupExpanded}
            /></div>
        );
      }


      if (isOver && canDrop && placeholderIndex === i) {
        if (this.state.direction == 'left') {
          isPlaced = true;
        } else {
          righter = true;
        }
      }
    });




    // if there is no items in cards currently, display a placeholder anyway
    if (isOver && canDrop && cards.length === 0) {

      window.placeholderIndex = placeholderIndex;
      if (this.state.direction == 'left') {
  //      cardList.push(<div key="placeholder" className="item placeholder" />);
      } else {
 //       cardList.push(<div key="placeholder" className="item placeholder2" />);
      }
      isPlaced = true;
    }


    return connectDropTarget(
      <div className="desk-items">
        {cardList}
      </div>
    );
  }
}

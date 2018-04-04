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
bodyElement.addEventListener("mousemove", getMouseDirection, false);

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
  // window.currentOffsetx = currentOffset.x;
  window.currentOffsety = yPos;
  return placeholderIndex;
}


function getMouseDirection(e) {
  //deal with the horizontal case
  if (oldX < e.pageX) {
    xDirection = "right";
  } else {
    xDirection = "left";
  }

  //deal with the vertical case
  if (oldY < e.pageY) {
    yDirection = "down";
  } else {
    yDirection = "up";
  }

  oldX = e.pageX;
  oldY = e.pageY;

  //  console.log("-----------> " + xDirection + " " + yDirection);
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

    if (lastY > nextY) { // move top
      nextY += 1;
    } else if (lastX !== nextX) { // insert into another list
      nextY += 1;
    }
    if (lastX === nextX && lastY === nextY) { // if position equel
      alert('put in last position');
      return;
    }


    if (window.cardId === null) {
      alert('MOVE null cardindex');
    } else {
      const index = _.findIndex(window.cards, function (o) { return o.id === window.cardId });
      try {
        alert('DROP' + window.cards[index].id);
        props.saveGroup(window.cards[index].id, monitor.getItem().id);
      } catch (e) {
        alert('error' + window.cardId);
      }
    }


    if (component.props.item.item.color === "orange" || component.props.item.item.color === "blue" || component.props.item.item.color === "green") {
      console.log('transform-drop', `${nextX}px, ${nextY}px)`);
    }


    props.moveCard(lastX, lastY, nextX, nextY);
  },
  hover(props, monitor, component) {
    //      console.log(component);
    //  const { placeholderIndex } = component.state;
    // let nextY = placeholderIndex;

    //   document.getElementById(monitor.getItem().id).style.background = 'purple';
    const nextX = props.x;
    const lastY = monitor.getItem().y;
    const lastX = monitor.getItem().x;
    let nextY = component.state.placeholderIndex;
    if (lastY > nextY) { // move top
      nextY += 1;
    } else if (lastX !== nextX) { // insert into another list
      nextY += 1;
    }

    let xxxx = window.innerWidth - monitor.getClientOffset().x;
    var node = findDOMNode(component);
    var getSourceClientOffset = monitor.getSourceClientOffset().x;

    // defines where placeholder is rendered
    let ress = monitor.getDropResult();
    // component.setState({ nextX: nextX, nextY: nextY, direction: (monitor.getDifferenceFromInitialOffset().x <= 0) ? 'left' : 'right', positioning: getSourceClientOffset });

    //  const draggedPosition = item.position;
    const hoverPosition = props.position;

    const newStyle = { 'display': 'none', 'left': '0px' };

    newStyle.display = 'block';

    let upDown2 = monitor.getClientOffset().y;
    let upDown3 = monitor.getInitialSourceClientOffset().y;
    let upDown4 = monitor.getInitialClientOffset().y;
    let upDown5 = monitor.getSourceClientOffset().y;
    let upDown = monitor.getDifferenceFromInitialOffset().y;
    let upDown6 = upDown2 + upDown;
    let upDown7 = upDown6 - upDown4;
    let leftright = monitor.getDifferenceFromInitialOffset().x;


    newStyle.left = window.innerWidth - monitor.getClientOffset().x - findDOMNode(component).getBoundingClientRect().left + 'px';
    component.setState({ node: node, style: newStyle, nextX: nextX, nextY: nextY, direction: (monitor.getDifferenceFromInitialOffset().x <= 0) ? 'left' : 'right', positioning: getSourceClientOffset });

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
    window.placeholderIndex = null;

    let filterList = _.cloneDeep(cards);

    filterList.forEach((item, i) => {

      let newKey = Date.now();
      item.color = 'white';
      item.marginLeft = '0px';
      item.marginRight = '0px';
      item.scale = '1';

      let colorr = 'white';
      if (this.state.node != undefined) {
    //    cardList.push(<div style={{ background: 'red', position: 'absolute', visibility: 'visible', top: `${window.currentOffsety}`, left: `${window.currentOffsetx}`, zIindex: '200', height: '300px' }} className="item placeholder3" />);
      }
      if (isOver && canDrop) {
        isPlaceHold = false;
        if (i === 0 && placeholderIndex === -1) {
          window.placeholderIndex = placeholderIndex;
          console.log('here2');
          if (this.state.node != undefined) {
         //   cardList.push(<div style={{ background: '#047a9c', position: 'absolute', visibility: 'visible', top: `${window.currentOffsety}`, left: `${window.currentOffsetx}`, zIindex: '200', height: '300px' }} className="item placeholder3" />);
          }
          if (this.state.direction == 'left') {
            item.marginLeft = '20px';
            cardList.push(<div key="placeholder" className="item placeholder" />);
            cardList.push(<div style={{ background: '#047a9c', position: 'absolute', visibility: 'visible', top: `${window.currentOffsety}`, left: `${window.currentOffsetx}`, zIindex: '200', height: `${window.height}` }} className="item placeholder3" />);
          } else {
            item.marginRight = '20px';
            cardList.push(<div key="placeholder" className="item placeholder2" />);
            cardList.push(<div style={{ background: '#047a9c', position: 'absolute', visibility: 'visible', top: `${window.currentOffsety}`, left: `${window.currentOffsetx}`, zIindex: '200', height: '300px' }} className="item placeholder3" />);
          }
        } else if (placeholderIndex > i) {
          isPlaceHold = true;
        }
      }

      if (righter) {
        window.placeholderIndex = placeholderIndex;
        item.marginRight = '20px';
        cardList.push(<div key="placeholder" className="item placeholder2" />);
        cardList.push(<div style={{ background: '#047a9c', position: 'absolute', visibility: 'visible', top: `${window.currentOffsety}`, left: `${window.currentOffsetx}`, zIindex: '200', height: '300px' }} className="item placeholder3" />);
        righter = false;
      }



      if (item !== undefined) {
        //   item.color = colorr;
        let height = 'auto';

        if (isOver && canDrop && placeholderIndex + 1 === i) {
          console.log('here3' + placeholderIndex + i);

          if (this.state.direction == 'left') {
            item.marginLeft = '20px';
          } else {
            item.marginRight = '20px';
          }
        }

        if (placeholderIndex + 1 !== cards.length && isPlaceHold) {
          console.log('here4');

          if (this.state.direction == 'left') {
            item.marginLeft = '20px';
          } else {
            item.marginRight = '20px';
          }
        }

        if (placeholderIndex + 1 !== cards.length && isPlaceHold) {
          console.log('here5');

          if (this.state.direction == 'left') {
            item.marginLeft = '20px';
          } else {
            item.marginRight = '20px';
          }
        }


        // item.scale = '1';
        //item.marginLeft = '0px';
        //item.marginRight = '0px';

        cardList.push(

          <div style={{
            backgroundColor: colorr,
            cursor: 'move',
            marginLeft: item.marginLeft,
            marginRight: item.marginRight,
            height: `${height}`,
            //        transform: `scale(${item.scale})`,
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
          cardList.push(<div key="placeholder" className="item placeholder" />);
          cardList.push(<div style={{ background: '#047a9c', position: 'absolute', visibility: 'visible', top: `${window.currentOffsety}`, left: `${window.currentOffsetx}`, zIindex: '200', height: '300px' }} className="item placeholder3" />);
        } else {
          righter = true;
        }
      }

      // if placeholder index is greater than array.length, display placeholder as last
      // if (placeholderIndex + 1 !== cards.length) {
      //   window.placeholderIndex = placeholderIndex;
      //   if (isPlaceHold) {
      //     if (this.state.direction == 'left') {
      //       cardList.push(<div key="placeholder" className="item placeholder" />);
      //     } else {
      //       cardList.push(<div key="placeholder" className="item placeholder2" />);
      //     }
      //   }
      // }
    });

    // if placeholder index is greater than array.length, display placeholder as last
    if (isPlaceHold) {
      window.placeholderIndex = placeholderIndex;
      if (this.state.direction == 'left') {
        cardList.push(<div key="placeholder" className="item placeholder" />);
      } else {
        cardList.push(<div key="placeholder" className="item placeholder2" />);
      }
      cardList.push(<div style={{ background: '#047a9c', position: 'absolute', visibility: 'visible', top: `${window.currentOffsety}`, left: `${window.currentOffsetx}`, zIindex: '200', height: '300px' }} className="item placeholder3" />);
    }



    // if there is no items in cards currently, display a placeholder anyway
    if (isOver && canDrop && cards.length === 0) {
      window.placeholderIndex = placeholderIndex;
      if (this.state.direction == 'left') {
        cardList.push(<div key="placeholder" className="item placeholder" />);
      } else {
        cardList.push(<div key="placeholder" className="item placeholder2" />);
      }
      cardList.push(<div style={{ background: '#047a9c', position: 'absolute', visibility: 'visible', top: `${window.currentOffsety}`, left: `${window.currentOffsetx}`, zIindex: '200', height: '300px' }} className="item placeholder3" />);
    }


    // console.log(cardList);
    return connectDropTarget(
      <div className="desk-items">
        {cardList}
      </div>
    );
  }
}

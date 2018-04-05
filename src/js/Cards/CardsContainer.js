import React, { Component, PropTypes } from 'react';
import { DropTarget, DragSource } from 'react-dnd';

import Cards from './Cards';

const listSource = {
  beginDrag(props) {
    return {
      id: props.id,
      x: props.x
    };
  },
  endDrag(props, monitor) {
    const item = monitor.getItem()
		const dropResult = monitor.getDropResult()

	
    props.stopScrolling();
  },
  canDrag(props) {
    return props.canDrag;
  }
};

const listTarget = {
  canDrop() {
    return false;
  },
  hover(props, monitor) {
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
    const { id: listId } = monitor.getItem();
    const { id: nextX } = props;
    if (listId !== nextX) {
      props.moveList(listId, props.x);
    }
  }
};
//ll
@DropTarget('list', listTarget, connectDragSource => ({ // eslint-disable-line
  connectDropTarget: connectDragSource.dropTarget()
}))
@DragSource('list', listSource, (connectDragSource, monitor) => ({  // eslint-disable-line
  connectDragSource: connectDragSource.dragSource(),
  isDragging: monitor.isDragging()
}))
export default class CardsContainer extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    item: PropTypes.object,
    x: PropTypes.number,
    moveCard: PropTypes.func.isRequired,
    saveGroup: PropTypes.func.isRequired,
    moveList: PropTypes.func.isRequired,
    isDragging: PropTypes.bool,
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
    this.state = {groupModeFlag: props.groupModeFlag, groupExpanded: props.groupExpanded};
  //  this.moveCard = this.moveCard.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({groupModeFlag: nextProps.groupModeFlag, groupExpanded: nextProps.groupExpanded});
  }

  render() {
    const { connectDropTarget, connectDragSource, item, x, moveCard, saveGroup, isDragging } = this.props;
    const opacity = isDragging ? 0.5 : 1;
    //const background = x == 0 ? 'gold' : null;
    // const cancelPng = require('../../assets/images/cancel.png');
    return connectDragSource(connectDropTarget(
      // shortcut for background:background
      <div className="desk" style={{ opacity }} >
        <div className="desk-head" style={{cursor: 'move'}}>
        </div>

        <Cards
          moveCard={moveCard}
          saveGroup={saveGroup}
          x={x}
          cards={item.cards}
          startScrolling={this.props.startScrolling}
          stopScrolling={this.props.stopScrolling}
          isScrolling={this.props.isScrolling}
          cancelAddCard={this.props.cancelAddCard}
          saveCard={this.props.saveCard}
          addCard={this.props.addCard}
          groupModeFlag={this.state.groupModeFlag}
          groupExpanded={this.state.groupExpanded} 
          handleGroupClick={this.props.handleGroupClick}
          groupExpanded={this.props.groupExpanded}
        />
      </div>
    ));
  }
}

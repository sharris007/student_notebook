import React, { Component, PropTypes } from 'react';
import { DragLayer } from 'react-dnd';

import CardDragPreview from './CardDragPreview';
import snapToGrid from './snapToGrid';
import { findDOMNode } from 'react-dom';

const layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100000
};


function getItemStyles(props) {
  const { initialOffset, currentOffset } = props;
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none'
    };
  }

  let { x, y } = currentOffset;
  let x1 = initialOffset.x;

  if (props.snapToGrid) {
    x -= initialOffset.x;
    y -= initialOffset.y;
    [x, y] = snapToGrid(x, y);
    x += initialOffset.x;
    y += initialOffset.y;
  }
  const transform = `translate(${x - 100}px, ${y - 100}px)`;
 // console.log('transform', `${x}px, ${y}px)`);
  return {
    WebkitTransform: transform,
    transform
  };
}



function getItemX(props) {

  const { initialOffset, currentOffset } = props;

  if (!initialOffset || !currentOffset) {
    return "white";
  }

  let { x, y } = currentOffset;

  if (props.snapToGrid) {
    x -= initialOffset.x;
    y -= initialOffset.y;
    [x, y] = snapToGrid(x, y);
    x += initialOffset.x;
    y += initialOffset.y;
  }

 // const transform = `translate(${x - 100}px, ${y - 100}px)`;

  
  let color = "white";
  
  const index = _.findIndex(window.cards, function (o) { return o.left < currentOffset.x+85 && o.left + 100 > currentOffset.x+85 && o.top < ((currentOffset.y-4)+ window.pageYOffset) && (o.top+(o.height/3)) > ((currentOffset.y-4)+ window.pageYOffset) });

  if (index === -1) {
    color = "yellow";

  } else {
    color = "blue";
    window.currentOffsetx = window.cards[index].left;
    window.height = '300';
    window.currentOffsety = currentOffset.y;
  debugger;
  }

 

  return color;
}





@DragLayer((monitor) => ({  // eslint-disable-line
  item: monitor.getItem(),
  itemType: monitor.getItemType(),
  initialOffset: monitor.getInitialSourceClientOffset(),
  currentOffset: monitor.getSourceClientOffset(),
  isDragging: monitor.isDragging()
}))
export default class CustomDragLayer extends Component {
  static propTypes = {
    item: PropTypes.object,
    itemType: PropTypes.string,
    initialOffset: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    }),
    currentOffset: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    }),
    isDragging: PropTypes.bool.isRequired,
    snapToGrid: PropTypes.bool.isRequired,
    groupModeFlag: PropTypes.bool
  };





  renderItem(type, item) {
    item.item.color = getItemX(this.props);
    switch (type) {
      case 'card':
        return (
          <CardDragPreview card={item} />
        );
      default:
        return null;
    }
  }

  render() {
    const { item, itemType, isDragging } = this.props;
    if (item !== null) {
      //  item.item.color = getItemX(item);
      //  item.item.color = "red";

    }

    if (!isDragging) {
      return null;
    }


    return (
      <div style={layerStyles}>
        <div style={getItemStyles(this.props)}>
          {this.renderItem(itemType, item)}
        </div>
      </div>
    );
  }
}

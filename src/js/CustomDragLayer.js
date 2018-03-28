import React, { Component, PropTypes } from 'react';
import { DragLayer } from 'react-dnd';

import CardDragPreview from './CardDragPreview';
import snapToGrid from './snapToGrid';


const layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100000
};


function getItemStyles(props) {
  console.log('rener1stylx');
  console.log(props);
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
  const transform = `translate(${x-100}px, ${y-100}px)`;
  console.log('transform', `${x}px, ${y}px)`);
  return {
    WebkitTransform: transform,
    transform
  };
}



function getItemX(props) {

  console.log('rener1x');
  console.log(props);
  const { initialOffset, currentOffset } = props;


  if (!initialOffset || !currentOffset) {
    return "pink";
  }

  let { x, y } = currentOffset;

  if (props.snapToGrid) {
    x -= initialOffset.x;
    y -= initialOffset.y;
    [x, y] = snapToGrid(x, y);
    x += initialOffset.x;
    y += initialOffset.y;
  }
  const transform = `translate(${x-100}px, ${y-100}px)`;
  console.log('transform', `${x}px, ${y}px)`);
  console.log('transform', `${initialOffset.x}px, ${initialOffset.y}px)`);
  console.log('transform', `${currentOffset.x}px, ${currentOffset.y}px)`);
  console.log(x%350);
  let color = "red";
  if (x > 150 && x < 200){
    color = "orange";
  }
  if (x > 500 && x < 600){
    color = "blue";
  }
  if (x > 940 && x < 1000){
    color = "green";
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
   item.item.color = "violet";
    item.item.color =  getItemX(this.props);
    console.log(item);
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
    console.log('rener1');
    console.log(item);
    if (item !== null){
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

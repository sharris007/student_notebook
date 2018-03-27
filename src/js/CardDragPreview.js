import React, { PropTypes } from 'react';
import Card from './Cards/Card';

const styles = {
  display: 'inline-block',
  transform: 'rotate(-3deg)',
  WebkitTransform: 'rotate(-3deg)'
};

const propTypes = {
  card: PropTypes.object,
  groupModeFlag: PropTypes.bool,
  groupExpanded: PropTypes.bool
};

const CardDragPreview = (props) => {
  styles.width = `${props.card.clientWidth || 243}px`;
  styles.height = `${props.card.clientHeight || 243}px`;
  let isOver = true;
console.log('cardDragPreview');
console.log(props.card.item.color);
  return (
    <div style={styles}>
      <Card item={props.card.item} groupModeFlag={props.groupModeFlag} groupExpanded={props.groupExpanded} />
      {isOver &&
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            zIndex: 1,
            opacity: 0.5,
            backgroundColor: `${props.card.item.color}`,
          }}></div>}
    </div>
  );
};

CardDragPreview.propTypes = propTypes;

export default CardDragPreview;

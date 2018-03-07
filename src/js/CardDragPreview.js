import React, { PropTypes } from 'react';
import Card from './Cards/Card';

const styles = {
  display: 'inline-block',
  transform: 'rotate(-3deg)',
  WebkitTransform: 'rotate(-3deg)'
};

const propTypes = {
  card: PropTypes.object,
  groupModeFlag: PropTypes.bool
};

const CardDragPreview = (props) => {
  styles.width = `${props.card.clientWidth || 243}px`;
  styles.height = `${props.card.clientHeight || 243}px`;

  return (
    <div style={styles}>
      <Card item={props.card.item} groupModeFlag={props.groupModeFlag} />
    </div>
  );
};

CardDragPreview.propTypes = propTypes;

export default CardDragPreview;

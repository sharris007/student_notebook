import React, { PropTypes } from 'react';
import Card from './Cards/Card';

const styles = {
  display: 'inline-block',
  transform: 'rotate(-3deg) scale(.90)',
  WebkitTransform: 'rotate(-3deg)',
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
  props.card.item.scale = '.90';
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
          transform: 'scale(90)',
        }}>
        </div>}
    </div>
  );
};

CardDragPreview.propTypes = propTypes;

export default CardDragPreview;

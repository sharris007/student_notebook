import React, { Component, PropTypes } from 'react';
import '../assets/temp.styl';
import RaisedButton from 'material-ui/RaisedButton';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import MenuItem from 'material-ui/MenuItem';

const VerticalLine = () => (
  <div style={{ float: 'left', borderLeft: '2px solid lightgrey', height: '40px', marginLeft: '10px', marginRight: '10px' }}></div>
);



const buttonAllStyle = {
  background: 'grey',
  borderRadius: '30px',
  fontSize: '12px',
  width: '75px',
  height: '40px',
  color: 'white'
};

const buttonStyles = {
  float: 'left',
  marginRight: '10px',
  background: 'white',
  borderColor: 'grey',
  borderWidth: '2px',
  borderRadius: '2px',
  fontSize: '15px',
  width: '100px',
  height: '40px',
  color: 'grey'
};

const buttonGroupStyle = {
  float: 'right',
  background: 'white',
  borderColor: 'grey',
  borderWidth: '2px',
  borderRadius: '2px',
  fontSize: '15px',
  height: '40px',
  color: 'grey',
  outline: 'none'
};


let groupModeToggleFlag = false;

let groupOn = {
  background: 'grey',
  height: '40px',
  'padding-right': '180px'
}

let groupOff = {
  height: '40px',
  'padding-right': '180px'

}

export default class NoteBookHeader extends Component {
  static propTypes = {
    callback: PropTypes.func,
    toolbarMode: PropTypes.object
  };




  constructor(props) {
    super(props);
debugger;
    this.handleOnChange = this.handleOnChange.bind(this);
    // const lists = [...props.lists];

    this.state = {
      isScrolling: false,
      search: '',
      ider: null,
      menuBarClass: 'test'
    };

  }



  handleOnChange(event) {
    this.props.getLists(6);
    this.setState({ search: event.target.value });
  }

  handleGroupNotesButton(event) {
    groupModeToggleFlag = !groupModeToggleFlag;
    this.props.callback('GROUP', groupModeToggleFlag);
  }

  render() {
    return (

        

        <div style={{marginLeft: '-180px'}}>
          <Toolbar>
            <ToolbarGroup>
              <FontIcon className="muidocs-icon-custom-sort" />
              {groupModeToggleFlag === false ? <RaisedButton label="All" buttonStyle={{ borderRadius: 25 }} labelColor={'white'} backgroundColor={"gray"} style={{ borderRadius: 25 }} onClick={() => this.handleGroupNotesButton()} />
                : null}
              {groupModeToggleFlag === false ? <ToolbarSeparator />
                : null}
                 {groupModeToggleFlag === false ? <RaisedButton label='Chapters'  onClick={() => this.handleGroupNotesButton()} />
                : null}
                 {groupModeToggleFlag === false ? <RaisedButton label="Label"  onClick={() => this.handleGroupNotesButton()} />
                : null}
            </ToolbarGroup>
            <ToolbarGroup>
              <FontIcon className="muidocs-icon-custom-sort" />
              {groupModeToggleFlag === false ? <RaisedButton label="Group notes" style={{ float: 'right' }} onClick={() => this.handleGroupNotesButton()} />
                : null}
              {groupModeToggleFlag === true ? <RaisedButton label="Cancel" style={{ float: 'right' }} onClick={() => this.handleGroupNotesButton()} />
                : null}
            </ToolbarGroup>
          </Toolbar>
        </div>
    );
  }
}

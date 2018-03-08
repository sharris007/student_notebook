import React, { Component, PropTypes } from 'react';
// import ImageUploader from './ImageUploader';
import Moment from 'moment';
import Linkify from 'react-linkify';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { blue500, red500, greenA200 } from 'material-ui/styles/colors';

const deletePng = require('../../assets/images/ic-trash.png');
const gotoPng = require('../../assets/images/goto-arrow-ico.png');
const addPng = require('../../assets/images/add.png');
const editPng = require('../../assets/images/edit.png');
const menuPng = require('../../assets/images/menu.png');
const checkmarkPng = require('../../assets/images/checkmark.png');

const ellipsis = {
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitLineClamp: 3,
  background: '#ffffff !important',
  WebkitBoxOrient: 'vertical'
};

const mainIdea = {
  backgroundColor: '#bbf2b6',
  height: '36px',
  paddingTop: '10px',
  paddingLeft: '10px',
  color: '#000000'
};

const fromInstructor = {
  backgroundColor: '#ccf5fd',
  height: '36px',
  paddingTop: '10px',
  paddingLeft: '10px',
  color: '#000000'
};

const observations = {
  backgroundColor: '#fed3ec',
  height: '36px',
  paddingTop: '10px',
  paddingLeft: '10px',
  color: '#000000'
};

const questions = {
  backgroundColor: '#ffedad',
  height: '36px',
  paddingTop: '10px',
  paddingLeft: '10px',
  color: '#000000'
};

const group = {
  backgroundColor: 'white',
  height: '36px',
  paddingTop: '10px',
  paddingLeft: '10px',
  color: 'black',
  textOverflow: 'ellipsis'
};

const styleContent = {
  width: '228px',
  height: '154px',
  fontSize: '14px',
  fontWeight: '600',
  lineHeight: '1.57',
  letterSpacing: '-0.2px',
  textAlign: 'left',
  color: '#252525',
  wordWrap: 'break-word'
};

const styleContent2 = {
  width: '228px',
  height: '154px',
  fontSize: '14px',
  lineHeight: '1.57',
  letterSpacing: '-0.3px',
  textAlign: 'left',
  color: '#252525'
};

const date = {
  fontSize: '12px',
  letterSpacing: '-0.1px',
  textAlign: 'left',
  color: '#6a7070',
  padding: '15px',
  paddingBottom: 0,
  background: 'white'
};

const title = {
  fontSize: '18px',
  letterSpacing: '-0.4px',
  textAlign: 'left',
  color: '#252525',
  fontWeight: '300',
  lineHeight: '1.44',
  padding: '15px',
  paddingBottom: 0,
  whiteSpace: 'normal',
  background: 'white'
};

const saveStyle = {
  fontSize: '16px',
  fontWeight: '600',
  letterSpacing: '-0.4px',
  color: '#047a9c'
};

const cancelStyle = {
  fontSize: '16px',
  fontWeight: '600',
  letterSpacing: '-0.4px',
  color: '#74797b'
};
const titleInputBox = {
  outline: '0',
  width: '100%',
  background: 'transparent',
  borderTop: '0',
  borderRight: '0',
  borderLeft: '0',
  borderBottom: '1px solid #6a7070',
  marginTop: '32px',
  fontSize: '18px',
  color: '#252525',
  letterSpacing: '-0.2px',
  color: '#252525'

};

const titleInputBoxDisabled = {
  outline: '0',
  width: '100%',
  background: 'transparent',
  border: '0',
  marginTop: '32px'
};

const noteTextArea = {
  borderRight: '0px',
  borderTop: '0px',
  borderLeft: '0px',
  borderBottom: '0px',
  width: '100%',
  outline: '0px',
  marginTop: '32px',
  background: 'white',
  fontFamily: 'Open Sans',
  fontSize: '14px',
  color: '#252525',
  letterSpacing: '-0.2px',
};

const addNote = {
  color: '#1ca6a5',
  fontWeight: '600',
  lineHeight: '1.57',
  fontSize: '14px',
  letterSpacing: '-0.2px',
  textAlign: 'center',
  height: '22px'

};

const line = {
  height: '2px',
  border: 'solid 1px #e9e9e9',
  marginLeft: '15px',
  marginRight: '15px'
};

const line2 = {
  height: '2px',
  border: 'solid 1px #e9e9e9',
  marginLeft: '15px',
  marginRight: '15px',
};





const Rtest = {
  width: '30px',
  height: '30px',
  borderRadius: '50%',
  background: 'white',
  position: 'relative',
  top: '-50px',
  left: '-10px',
  border: 'solid',
  borderWidth: '2px',
  borderColor: 'pink',
  marginBottom: '-30px',
  outline: 'none'
};



const Buttony = ({ className }) => (
  <div style={className}> </div>
);



export default class Card extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    style: PropTypes.object,
    cancelAddCard: PropTypes.func,
    saveCard: PropTypes.func,
    addCard: PropTypes.func,
    groupModeFlag: PropTypes.bool
  };

  constructor(props) {
    // alert('ggsssgg');
    
    super(props);
    this.handleCancelAddCard = this.handleCancelAddCard.bind(this);
    this.handleAddCard = this.handleAddCard.bind(this);
    this.handleDeleteCard = this.handleDeleteCard.bind(this);
    this.handleMenuItemChange = this.handleMenuItemChange.bind(this);
    this.handleDeleteMenuItem = this.handleDeleteMenuItem.bind(this);
    this.handleEditMenuItem = this.handleEditMenuItem.bind(this);
    this.state = {
      item: props.item,
      titleMaxLength: 100,
      noteMaxLength: 3000,
      noteMaxLengthWarning: '',
      hideSave: true,
      selected: false,
      groupModeFlag: props.groupModeFlag,
      selectedMenuItem: null
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ groupModeFlag: nextProps.groupModeFlag });
  }


  handleCancelAddCard = (card) => {
    if (card.id === 'new' || card.id === '') {
      this.props.cancelAddCard();
    } else {
      card.cardFormat = 'note';
      this.setState({ item: card });
    }
    this.setState({ hideSave: true });
  };

  handleSaveCard = (card) => {
    // this.setState(
    //   titleInput: this.titleInput.value
    // });

    const newNote = {
      id: card.id,
      keyId: card.keyId,
      title: card.pageId ? card.title : this.titleInput.value,
      changeDate: Date.parse(new Date()),
      content: this.contentArea.value,
      noteText: card.noteText ? card.noteText : '',
      cardFormat: 'note',
      colorCode: card.colorCode ? card.colorCode : '',
      pageId: card.pageId ? card.pageId : '',
      highLightText: card.highLightText ? card.highLightText : '',
      customAnnotation: card.customAnnotation ? card.customAnnotation : false
    };
    const msg = (card.id === 'new' || card.id === '') ? 'ADD' : 'SAVE';
    if (msg === 'ADD') {
      this.props.saveCard(newNote, msg);
    } else if (msg === 'SAVE') {
      this.setState({ item: newNote }, () => {
        this.props.saveCard(this.state.item, msg);
      });
    }
  };

  handleEditCard = (card) => {
    card.cardFormat = 'create new';
    this.setState({ item: card }, () => {
      this.titleInput.value = card.pageId ? card.highLightText : card.title;
      this.contentArea.value = card.content;
    });
  }

  handleDeleteCard = () => {
    this.props.saveCard(this.state.item, 'DELETE');
  }

  handleMenuItemChange = (event, value) => {
    if (value === 'Delete note')
      this.props.saveCard(this.state.item, 'DELETE');
    else if (value === 'Edit note') {
      let card = this.state.item;
      card.cardFormat = 'create new';
      this.setState({ item: card }, () => {
        this.titleInput.value = card.pageId ? card.highLightText : card.title;
        this.contentArea.value = card.content;
      });
    }
  }

  handleDeleteMenuItem = (event, value) => {
    this.props.saveCard(this.state.item, 'DELETE');
  }

  handleEditMenuItem = (event, value) => {
    this.props.saveCard(this.state.item, 'DELETE');
  }

  handleNavigate = () => {
    this.props.saveCard(this.state.item, 'NAVIGATE');
  }

  handleAddCard = () => {
    this.props.addCard();
  };

  handleSelectCard = () => {
    const msg = (!this.state.selected === true) ? 'SELECTED' : 'UNSELECTED';

    this.setState({ selected: !this.state.selected }, () => {

      this.props.saveCard(this.state.item, msg);
      // this.props.selectCard(card);
    });
  };

  checkNoteMaxLengthValidation = () => {
    const inputCharLength = this.contentArea.value.length;
    const inputCharLengthTitle = this.titleInput.value.length;
    const remainingCount = this.state.noteMaxLength - inputCharLength;
    let noteMaxLengthWarning = '';
    if (remainingCount > 0 && remainingCount < 51) {
      noteMaxLengthWarning = `-${remainingCount} characters left`;
    } else if (remainingCount === 0) {
      noteMaxLengthWarning = `${remainingCount} characters left`;
    } else {
      noteMaxLengthWarning = '';
    }
    //Visible Save button after entering note text
    const hideSave = inputCharLength > 0 || inputCharLengthTitle > 0 ? false : true;
    this.setState({
      noteMaxLengthWarning,
      hideSave
    });
  }

  render() {
    const { style } = this.props;
    // const { item } = this.state;
    const item = Object.assign({}, this.state.item);
    const disablehighLightText = item.pageId ? { 'disabled': 'disabled' } : {};
    return (
      <div
        style={{ background: 'white' }}
        className="item"
        id={style ? item.id : null}
      >
        {item.noteText === 'M' ? (
          <div className="item-name" style={mainIdea}>
            <div>Main ideas</div>
            <div className="delete-perfomers" style={{ float: 'right', 'marginTop': '-23px' }}>
              <IconMenu
                iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                targetOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                iconStyle={{ fill: 'black', 'marginTop': '-20px' }}
                onChange={this.handleMenuItemChange}
                value={this.state.selectedMenuItem}
              >
                <MenuItem value='Delete note' primaryText="Delete note" />
                <MenuItem value='Edit note' primaryText="Edit note" />
              </IconMenu>
            </div>
          </div>
        ) : null}
        {item.noteText === 'I' ? (
          <div className="item-name" style={fromInstructor}>
            <div>From Instructor</div>
             <div className="delete-perfomers" style={{ float: 'right', 'marginTop': '-23px' }}>
              <IconMenu
                iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                targetOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                iconStyle={{ fill: 'black', 'marginTop': '-20px' }}
                onChange={this.handleMenuItemChange}
                value={this.state.selectedMenuItem}
              >
                <MenuItem value='Delete note' primaryText="Delete note" />
                <MenuItem value='Edit note' primaryText="Edit note" />
              </IconMenu>
            </div> 
          </div>
        ) : null}
        {item.noteText === 'O' ? (
          <div className="item-name" style={observations}>
            <div>Observations</div>
            <div className="delete-perfomers" style={{ float: 'right', 'marginTop': '-23px' }}>
              <IconMenu
                iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                targetOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                iconStyle={{ fill: 'black', 'marginTop': '-20px' }}
                onChange={this.handleMenuItemChange}
                value={this.state.selectedMenuItem}
              >
                <MenuItem value='Delete note' primaryText="Delete note" />
                <MenuItem value='Edit note' primaryText="Edit note" />
              </IconMenu>
            </div>
          </div>
        ) : null}
        {item.noteText === 'Q' ? (
          <div className="item-name" style={questions}>
            <div>Questions</div>
            <div className="delete-perfomers" style={{ float: 'right', 'marginTop': '-23px' }}>
              <IconMenu
                iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                targetOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                iconStyle={{ fill: 'black', 'marginTop': '-20px' }}
                onChange={this.handleMenuItemOnChange}
                value={this.state.selectedMenuItem}
              >
                <MenuItem value='Delete note' primaryText="Delete note" />
                <MenuItem value='Edit note' primaryText="Edit note" />
              </IconMenu>
            </div>
          </div>
        ) : null}
        {item.cardFormat === 'note' && item.noteText === 'G' ? (
          <div className="item-name" style={group}>
            <div style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', width: '85%' }}>{item.title}</div>
            <div className="delete-perfomers" style={{ float: 'right', 'marginTop': '-23px' }}>
              <IconMenu
                iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                targetOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                iconStyle={{ fill: 'black', 'marginTop': '-20px' }}
              >
                <MenuItem primaryText="Rename group" />
                <MenuItem primaryText="Ungroup notes" />
              </IconMenu>
            </div>

          </div>
        ) : null}

        {item.cardFormat === 'note' && this.state.groupModeFlag === true && item.colorCode !== 'GROUP' ?
          <button style={Rtest} onClick={() => this.handleSelectCard(item)}>
            {this.state.selected ? <img src={checkmarkPng} /> : null}</button>
          : null}


        {item.cardFormat === 'note' ? (
          <div style={date}>{Moment(new Date(item.changeDate)).format('MMMM DD, YYYY')}</div> // eslint-disable-line
        ) : null}
        {item.cardFormat === 'note' ? (
          <div style={title}>{item.title}</div>
        ) : null}
        {item.cardFormat === 'add mode' ? (
          <div style={{ paddingTop: '100px' }} />
        ) : null}
        {item.cardFormat === 'add mode' ? (
          <div style={{ 'textAlign': 'center' }}>
            <button
              onClick={this.handleAddCard}
              style={{ border: '0', background: 'transparent' }}
            >
              <img src={addPng} />
            </button>
          </div>
        ) : null}
        {item.cardFormat === 'add mode' ? (
          <div style={addNote}>Add Note</div>
        ) : null}
        {item.cardFormat === 'add mode' ? (
          <div style={{ paddingBottom: '100px' }} />
        ) : null}

        {item.cardFormat !== 'note' ? (
          <div className="item-container">
            <div className="item-content">
              <div id="create-card" className="Mask">
                {item.cardFormat !== 'add mode' && !item.pageId ? (
                  <input
                    style={titleInputBox}
                    ref={(el) => {
                      this.titleInput = el;
                    }}
                    placeholder="Title"
                    maxLength={this.state.titleMaxLength}
                    {...disablehighLightText}
                    onKeyUp={this.checkNoteMaxLengthValidation}
                    autoFocus
                  />
                ) : null}

                {item.cardFormat !== 'add mode' && item.pageId ? (
                  <input
                    style={titleInputBoxDisabled}
                    ref={(el) => {
                      this.titleInput = el;
                    }}
                    placeholder="Title"
                    maxLength={this.state.titleMaxLength}
                    {...disablehighLightText}
                  />
                ) : null}

                {this.state.titleInput}
                {item.cardFormat !== 'add mode' ? (
                  <textarea
                    rows="10"
                    cols="50"
                    style={noteTextArea}
                    placeholder="Write note..."
                    ref={(el) => {
                      this.contentArea = el;
                    }}
                    maxLength={this.state.noteMaxLength}
                    onKeyUp={this.checkNoteMaxLengthValidation}
                  />
                ) : null}
              </div>
            </div>
          </div>
        ) : (
            <div>
              {item.cardFormat === 'note' && item.pageId ? <div className="item-container">
                <div className="item-content">
                  <span style={styleContent}>“{item.highLightText}”</span>
                </div>
              </div> : null}

              {item.cardFormat === 'note' && item.pageId ?
                null : <br />}

              {item.cardFormat === 'note' && item.pageId ?
                <div style={line} /> : null}

              {item.cardFormat === 'note' && !item.pageId ? <div className="item-container">
                <div className="item-content">
                  <span style={styleContent2}><Linkify properties={{ target: '_blank' }}>{item.content}</Linkify></span>
                </div>
              </div> : null}

              {item.cardFormat === 'note' && item.pageId ? <div className="item-container">
                <div className="item-content">
                  <span style={styleContent2}><Linkify properties={{ target: '_blank' }}>{item.content}</Linkify></span>
                </div>
              </div> : null}
            </div>
          )}

        {item.cardFormat === 'note' ? (
          <div className="item-perfomers">
            {item.noteText === 'I' ? null : <div className="add-perfomers">
              <a style={{ height: '36px', width: '36px', padding: '10px', margin: '0' }} onClick={() => this.handleDeleteCard(item)}>
                <img
                  style={{ height: '16px', width: '16px' }}
                  src={deletePng}
                  alt="delete"
                />
              </a>

            </div>}

            {item.noteText === 'I' ? null : <div style={{ width: '5px' }} className="add-perfomers">&nbsp;</div>}

            {item.noteText === 'I' ? null : <div className="add-perfomers">
              <a style={{ height: '36px', width: '36px', padding: '10px', margin: '0' }} onClick={() => this.handleEditCard(item)}>
                <img
                  style={{ height: '16px', width: '16px' }}
                  src={editPng}
                  alt="edit"
                />
              </a>
            </div>}

            {!!item.pageId ?
              <div className="delete-perfomers">
                <a style={{ height: '36px', width: '36px', margin: '0', padding: '5px' }} onClick={() => this.handleNavigate(item)}>
                  <img
                    style={{ height: '24px', width: '24px' }}
                    src={gotoPng}
                    alt="navigate"
                  />
                </a>
              </div>
              : null}
          </div>
        ) : (
            <div className="item-perfomers">
              {item.cardFormat === 'create new' ? (
                <div>
                  {!this.state.hideSave ?
                    <a
                      style={{ float: 'right', paddingRight: '5px', color: '#1ca6a5' }}
                      onClick={() => this.handleSaveCard(item)}
                    >
                      <span style={saveStyle}>SAVE</span>
                    </a>
                    : null
                  }
                  <a
                    style={{ float: 'right', paddingRight: '15px', color: '#1ca6a5' }}
                    onClick={() => { this.handleCancelAddCard(item); }}
                  >
                    <span style={cancelStyle}>CANCEL</span>
                  </a>
                  {this.state.noteMaxLengthWarning.length ? <span style={{ color: '#db0020' }}>{this.state.noteMaxLengthWarning}</span> : null}
                </div>
              ) : null}
            </div>

          )}



        

       
        {item.noteText === 'G' ?
          <div style={{  height: '60px', background: 'white', marginBottom: '0px', marginLeft: '1px', borderBottomLeftRadius: '.3em', borderBottomStyle: 'solid', borderBottomWidth: '2px', borderBottomColor: 'rgb(233, 233, 233)' }}><div style={{ background: 'pink', width: '11px', height: '60px', borderBottomLeftRadius: '.3em',  marginLeft: '-1px' }}><br/><table><tr><td><div style={{  textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', marginLeft: '20px', width: '150px' }}>1.1 plants</div></td><td><div style={{fontSize: '12px', letterSpacing: '-0.1px', textAlign: 'left', color: 'rgb(106, 112, 112)', padding: '0px 15px 0px', background: 'white'}}>December 06, 2017</div></td></tr></table></div></div>
          : null}


        {item.noteText === 'G' ?
          <div style={{  background: 'white', marginBottom: '0px',  borderBottomLeftRadius: '.9em' }}><div style={{ background: 'rgb(255, 237, 173)', width: '11px', height: '30px', borderBottomLeftRadius: '.4em' }}></div></div>
          : null}

       


       
      </div>
    );
  }
}

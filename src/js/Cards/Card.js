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
const selectPng = require('../../assets/images/select.png');
const selectedPng = require('../../assets/images/selected.png');

const ellipsis = {
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitLineClamp: 3,
  background: '#ffffff !important',
  WebkitBoxOrient: 'vertical'
};

const mainIdea = {
  //backgroundColor: '#bbf2b6',
  height: '36px',
  paddingTop: '10px',
  paddingLeft: '10px',
  color: '#000000'
};

const fromInstructor = {
  //  backgroundColor: '#ccf5fd',
  height: '36px',
  paddingTop: '10px',
  paddingLeft: '10px',
  color: '#000000'
};

const observations = {
  //  backgroundColor: '#fed3ec',
  height: '36px',
  paddingTop: '10px',
  paddingLeft: '10px',
  color: '#000000'
};

const questions = {
  ///backgroundColor: '#ffedad',
  height: '36px',
  paddingTop: '10px',
  paddingLeft: '10px',
  color: '#000000'
};

const group = {
  backgroundColor: 'white',
  height: '44px',
  color: 'black',
  textOverflow: 'ellipsis'
};

const renameDiv = {
  display: 'none'
}

const renameInput = {
  height: '36px',
  cursor: 'pointer',
  border: 'none',
  backgroundColor: '#FFFFFF',
  padding: '10px',
  width: '97%'
}

const styleContent = {
  width: '228px',
  height: '154px',
  fontSize: '16px',
  fontWeight: 'bold',
  lineHeight: '1.38',
  letterSpacing: '-0.2px',
  textAlign: 'left',
  color: '#252525',
  wordWrap: 'break-word',
  fontFamily: 'Palatino',
  fontStyle: 'normal',
  fontStretch: 'normal'

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
  fontSize: '12px',
  letterSpacing: '-0.2px',
  textAlign: 'left',
  color: '#252525',
  fontWeight: '300',
  lineHeight: '1.5',
  padding: '16px',
  paddingBottom: 0,
  whiteSpace: 'normal',
  background: 'white'
};
const customtitle = {
  fontSize: '16px',
  letterSpacing: '-0.2px',
  textAlign: 'left',
  color: '#252525',
  fontWeight: '600',
  lineHeight: '1.38',
  padding: '16px',
  paddingBottom: 0,
  whiteSpace: 'normal',
  background: 'white',
  fontFamily: 'Open Sans',
  fontStyle: 'normal',
  fontStretch: 'normal'
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
  marginTop: '0',
  fontSize: '18px',
  color: '#252525',
  letterSpacing: '-0.2px',
  color: '#252525'

};
const padding0 = {
  padding: '0'
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
  marginTop: '15px',
  background: 'white',
  fontFamily: 'Open Sans',
  fontSize: '14px',
  color: '#252525',
  letterSpacing: '-0.2px',
};

const addNote = {
  textAlign: 'center',
  fontFamily: 'Open Sans',
  fontSize: '13px',
  fontWeight: 'normal',
  fontStyle: 'normal',
  fontStretch: 'normal',
  lineHeight: '1.69',
  letterSpacing: '-0.2px',
  color: '#6a7070',
  paddingTop: '5px'
};

const line = {
  height: '2px',
  borderBottom: '1.5px solid #e9e9e9',
  marginLeft: '15px',
  marginRight: '15px'
};

const line2 = {
  height: '2px',
  border: 'solid 1px #e9e9e9',
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

const optionListStyle = {
  fontFamily: 'Open Sans',
  fontSize: '14px',
  fontWeight: 'normal',
  fontStyle: 'normal',
  fontStretch: 'normal',
  lineHeight: 'normal',
  letterSpacing: 'normal',
  textAlign: 'left',
  color: '#252525',
  padding: '8px 5px 0 5px',
  height: '19px',
  minHeight: '40px'
};

const groupTitle = {
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  width: '85%',
  fontFamily: 'Open Sans',
  fontSize: '14px',
  fontWeight: 'normal',
  fontStyle: 'normal',
  fontStretch: 'normal',
  lineHeight: 'normal',
  letterSpacing: '0.3px',
  textAlign: 'center',
  color: '#252525'
}

const menuOption = {
  fontFamily: 'Open Sans',
  fontSize: '14px',
  fontWeight: 'normal',
  fontStyle: 'normal',
  fontStretch: 'normal',
  lineHeight: 'normal',
  letterSpacing: 'normal',
  textAlign: 'left',
  color: '#252525',
  padding: '8px 0px 0px',
  minHeight: '40px',
  height: '19px'
}

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
    groupModeFlag: PropTypes.bool,
    tagId: PropTypes.func,
    handleGroupClick: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.handleCancelAddCard = this.handleCancelAddCard.bind(this);
    this.handleAddCard = this.handleAddCard.bind(this);
    this.handleDeleteCard = this.handleDeleteCard.bind(this);
    this.handleMenuItemChange = this.handleMenuItemChange.bind(this);
    this.handleDeleteMenuItem = this.handleDeleteMenuItem.bind(this);
    this.handleEditMenuItem = this.handleEditMenuItem.bind(this);
    this.handleRenameGroup = this.handleRenameGroup.bind(this);
    this.handleUnGroupNotes = this.handleUnGroupNotes.bind(this);
    this.handleRenameSave = this.handleRenameSave.bind(this);
    this.handleClickGroup = this.handleClickGroup.bind(this);
    this.noteTypebackgroundColor = this.noteTypebackgroundColor.bind(this);

    this.state = {
      item: props.item,
      titleMaxLength: 100,
      noteMaxLength: 3000,
      noteMaxLengthWarning: '',
      hideSave: true,
      selected: props.item.selected,
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
      timeStamp: Date.parse(new Date()),
      content: this.contentArea.value,
      noteType: card.noteType ? card.noteType : 'CUSTOM_NOTE',
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

  handleClickGroup = () => {
    let _item = this.state.item ? this.state.item : null;
    this.props.handleGroupClick(_item.tags[0].tagId, _item.tags[0].tagName);
  }
  handleRenameGroup = (event, value) => {
    this.groupTitle.style.display = 'none';
    this.renameDiv.style.display = 'block';
  }

  handleUnGroupNotes = (event, value) => {
    let updatedItem = this.state.item;
    //updatedItem.tags[0].tagId = '';
    //updatedItem.insetSeq = '';
    this.setState({ item: updatedItem }, () => {
      this.props.saveCard(this.state.item, 'UNGROUP NOTES');
    });
  }

  handleRenameSave = (event, value) => {
    let updatedItem = this.state.item;
    updatedItem.tags[0].tagName = this.renameInput.value;
    this.setState({ item: updatedItem }, () => {
      this.props.saveCard(this.state.item, 'RENAME');
      this.groupTitle.style.display = 'block';
      this.renameDiv.style.display = 'none';
    });
  }

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

  noteTypebackgroundColor = (notetype) => {
    if (notetype === "FROM_INSTRUCTOR") {
      return "#ccf5fd";
    } else if (notetype === "MAIN_IDEAS") {
      return "#bbf2b6";
    } else if (notetype === "OBSERVATIONS") {
      return "#fed3ec";
    } else if (notetype === "QUESTIONS") {
      return "#ffedad";
    } else {
      return "none";
    }
  }

  render() {
    const { style } = this.props;
    // const { item } = this.state;
    const item = Object.assign({}, this.state.item);
    const tagId = (item.tags && item.tags[0].tagId) ? item.tags[0].tagId : '';
    const tagName = (item.tags && item.tags[0].tagName) ? item.tags[0].tagName : '';
    //const tagName = (item.tags && item.tags[0].tagName) ? item.tags[0].tagName : 'Test Tag 123456';
    const disablehighLightText = item.pageId ? { 'disabled': 'disabled' } : {};
    return (


      <div
        //    style={{ background: 'white' }}
        style={tagId ? { background: 'white', boxShadow: 'none' } : { background: 'white' }}
        className={(item.cardFormat === 'add mode') ? "item addcardStyle" : "item"}
        data-tagId= {tagId ? tagId: null} id={style ? item.id : null}
      >


        {item.noteType === 'CUSTOM_NOTE' && !tagId ? (
          <div className="item-name" style={observations}>
            <div className="delete-perfomers" style={{ float: 'right' }}>
              <IconMenu
                iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                iconStyle={{ fill: 'black', 'marginTop': '-20px' }}
                onChange={this.handleMenuItemChange}
                value={this.state.selectedMenuItem}
              >
                <MenuItem style={menuOption} value='Delete note' primaryText="Delete note" />
                <MenuItem style={menuOption} value='Edit note' primaryText="Edit note" />
              </IconMenu>
            </div>
          </div>
        ) : null}
        {item.noteType === 'MAIN_IDEAS' && !tagId ? (
          <div className="item-name" style={mainIdea}>
            <div className="delete-perfomers" style={{ float: 'right' }}>
              <IconMenu
                iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                iconStyle={{ fill: 'black', 'marginTop': '-20px' }}
                onChange={this.handleMenuItemChange}
                value={this.state.selectedMenuItem}
              >
                <MenuItem style={menuOption} value='Delete note' primaryText="Delete note" />
                <MenuItem style={menuOption} value='Edit note' primaryText="Edit note" />
              </IconMenu>
            </div>
          </div>
        ) : null}
        {item.noteType === 'FROM_INSTRUCTOR' && !tagId ? (
          <div className="item-name" style={fromInstructor}>
          </div>
        ) : null}


        {item.noteType === 'OBSERVATIONS' && !tagId ? (
          <div className="item-name" style={observations}>
            <div className="delete-perfomers" style={{ float: 'right' }}>
              <IconMenu
                iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                iconStyle={{ fill: 'black', 'marginTop': '-20px' }}
                onChange={this.handleMenuItemChange}
                value={this.state.selectedMenuItem}
              >
                <MenuItem style={menuOption} value='Delete note' primaryText="Delete note" />
                <MenuItem style={menuOption} value='Edit note' primaryText="Edit note" />
              </IconMenu>
            </div>
          </div>
        ) : null}
        {item.noteType === 'QUESTIONS' && !tagId ? (
          <div className="item-name" style={questions}>
            <div className="delete-perfomers" style={{ float: 'right' }}>
              <IconMenu
                iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                iconStyle={{ fill: 'black', 'marginTop': '-20px' }}
                onChange={this.handleMenuItemChange}
                value={this.state.selectedMenuItem}
              >
                <MenuItem style={menuOption} value='Delete note' primaryText="Delete note" />
                <MenuItem style={menuOption} value='Edit note' primaryText="Edit note" />
              </IconMenu>
            </div>
          </div>
        ) : null}
        {item.cardFormat === 'note' && tagId ? (
          <div>
            <div className="item-name" style={group} ref={(ele) => {
              this.groupTitle = ele;
            }} >

              <div onClick={this.handleClickGroup} style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', padding:'13px 0'}}> <center>{tagName}</center></div>
              <div className="delete-perfomers" style={{ float: 'right', 'marginTop': '-36px' }}>
                <IconMenu
                  iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                  anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                  targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                  iconStyle={{ fill: 'black', 'marginTop': '-20px' }}
                >
                  <MenuItem onClick={this.handleRenameGroup} style={optionListStyle} primaryText="Rename group" />
                  <MenuItem onClick={this.handleUnGroupNotes} style={optionListStyle} primaryText="Ungroup notes" />
                </IconMenu>
              </div>



            </div>
            <div className="rename-group" id="rename-group" ref={(ele) => {
              this.renameDiv = ele;
            }} style={renameDiv}>
              <input
                type="text"
                className="renamegroup"
                ref={(ele) => {
                  this.renameInput = ele;
                }}
                defaultValue={tagName}
                style={renameInput}
                onBlur={this.handleRenameSave}
              />
            </div>
          </div>



        ) : null}



        {item.cardFormat === 'note' && tagId ?
          <div style={line2} /> : null}


        {item.cardFormat === 'note' && this.state.groupModeFlag === true && !tagId ?
          <div style={{ position: 'relative', top: '-50px', left: '-10px' }} onClick={() => this.handleSelectCard(item)}>
            {this.state.selected ? <img src={selectedPng} /> : <img src={selectPng} />}</div>
          : null}

        {item.cardFormat === 'note' ? (
          <div style={item.noteType === 'CUSTOM_NOTE' ? customtitle : title}>{item.title}</div>
        ) : null}
        {item.cardFormat === 'add mode' ? (
          <div style={{ paddingTop: '115px' }} />
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
          <div style={{ paddingBottom: '92px' }} />
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
              {item.cardFormat === 'note' && item.pageId ? <div className="item-container" style={{ paddingTop: '10px' }}>
                <div className="item-content">
                  <table style={{ tableLayout: 'fixed', width: '100%' }}><tbody><tr>
                    <td width='85%'>
                      <span style={styleContent}>“{item.highLightText}”</span>
                    </td>
                    <td>
                      {(!!item.pageId && !(item.notes && item.notes.length)) ?
                        <a style={{ margin: '0', float: 'right' }} onClick={() => this.handleNavigate(item)}>
                          <img
                            style={{ height: '24px', width: '24px' }}
                            src={gotoPng}
                            alt="navigate"
                          />
                        </a> : null}</td></tr></tbody></table>
                </div>
              </div> : null}

              {item.cardFormat === 'note' && item.pageId ?
                <div style={line} /> : null}

              {item.cardFormat === 'note' && !item.pageId ? <div className="item-container" style={{ paddingTop: '11.1px', paddingBottom: '0' }}>
                <div className="item-content" style={{ paddingRight: '8px' }}>
                  <span style={styleContent2}><Linkify properties={{ target: '_blank' }}>{item.content}</Linkify></span>
                </div>
              </div> : null}

              {item.cardFormat === 'note' && item.pageId ? <div className="item-container" style={{ paddingTop: '20px' }}>
                <div className="item-content" style={{ paddingRight: '8px' }}>
                  <span style={styleContent2}><Linkify properties={{ target: '_blank' }}>{item.content}</Linkify></span>
                </div>
              </div> : null}
            </div>
          )}

        {item.cardFormat === 'note' ? (
          <div className="item-perfomers" >
          </div>
        ) : (
            <div className="item-perfomers" style= {(item.cardFormat === 'add mode') ? padding0 : null}>
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
        {item.noteType === 'FROM_INSTRUCTOR' && !tagId ? (
          <div><span className="verticalAlign" style={{ background: '#ccf5fd', width: '11px', height: '60px', borderBottomLeftRadius: '4px' }}></span><table className="verticalAlign footerTable"><tbody><tr><td width="50%"><div className="footerNote">From instructor</div></td><td width="50%"><div className="footerDate">{Moment(new Date(item.timeStamp)).format('MMMM DD, YYYY')}</div></td></tr></tbody></table></div>
        ) : null}

        {item.noteType === 'MAIN_IDEAS' && !tagId ? (
          <div><span className="verticalAlign" style={{ background: '#bbf2b6', width: '11px', height: '60px', borderBottomLeftRadius: '4px' }}></span><table className="verticalAlign footerTable"><tbody><tr><td width="50%"><div className="footerNote">Main ideas</div></td><td width="50%"><div className="footerDate">{Moment(new Date(item.timeStamp)).format('MMMM DD, YYYY')}</div></td></tr></tbody></table></div>
        ) : null}

        {item.noteType === 'OBSERVATIONS' && !tagId ? (
          <div><span className="verticalAlign" style={{ background: '#fed3ec', width: '11px', height: '60px', borderBottomLeftRadius: '4px' }}></span><table className="verticalAlign footerTable"><tbody><tr><td width="50%"><div className="footerNote">Main observations</div></td><td width="50%"><div className="footerDate">{Moment(new Date(item.timeStamp)).format('MMMM DD, YYYY')}</div></td></tr></tbody></table></div>
        ) : null}

        {item.noteType === 'QUESTIONS' && !tagId ? (
          <div><span className="verticalAlign" style={{ background: '#ffedad', width: '11px', height: '60px', borderBottomLeftRadius: '4px' }}></span><table className="verticalAlign footerTable"><tbody><tr><td width="50%"><div className="footerNote">Questions</div></td><td width="50%"><div className="footerDate">{Moment(new Date(item.timeStamp)).format('MMMM DD, YYYY')}</div></td></tr></tbody></table></div>
        ) : null}

        {item.noteType === 'CUSTOM_NOTE' && !tagId ? (
          <div><span className="verticalAlign" style={{ background: '#ffffff', width: '11px', height: '60px', borderBottomLeftRadius: '4px' }}></span><table className="verticalAlign footerTable"><tbody><tr><td width="50%"><div className="footerNote"></div></td><td width="50%"><div className="footerDate">{Moment(new Date(item.timeStamp)).format('MMMM DD, YYYY')}</div></td></tr></tbody></table></div>
        ) : null}


        {tagId ?
          <div style={{ background: 'white', marginBottom: '0px', marginLeft: '1px', borderBottomLeftRadius: '.5em', zIndex: '1000', width: '100%', position: 'relative', boxShadow: 'rgb(153, 145, 153) -1px -3px 12px -5px  inset', borderRadius: '4px' }}>
            <div>
              <span className="verticalAlign" style={{ background: `${this.noteTypebackgroundColor(item.noteType)}`, width: '11px', height: '60px', borderBottomLeftRadius: '.3em', marginLeft: '-1px', borderBottomLeftRadius: '4px' }}></span>
              <table className="verticalAlign footerTable">
                <tbody>
                  <tr>
                    <td width="50%">
                      <div className="footerNote">
                        {item.noteType === 'QUESTIONS' ?
                          `Questions`
                          : null}


                        {item.noteType === 'FROM_INSTRUCTOR' ?
                          'From instructor'
                          : null}
                        {item.noteType === 'MAIN_IDEAS' ?
                          `Main ideas`
                          : null}

                        {item.noteType === 'OBSERVATIONS' ?
                          `Main observations`
                          : null}

                      </div></td>
                    <td width="50%">
                      <div className="footerDate">{Moment(new Date(item.timeStamp)).format('MMMM DD, YYYY')}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          : null}


        {tagId ?
          item.notes.map((note, i) => (
            //  item.notes.splice(1).map((note, i) => (
            <div style={{ display: `${i === 0 ? 'none' : null}`, background: 'white', marginBottom: '0px', borderBottomLeftRadius: '4px', borderBottomRightRadius: '4px', width: '100%', zIndex: `${1000 - (i + 1)}`, position: 'relative', boxShadow: 'rgb(153, 145, 153) -1px -3px 12px -5px  inset' }}>
  
               <div style={{ background: `${this.noteTypebackgroundColor(note.noteType)}`, width: '11px', height: '20px', borderBottomLeftRadius: '4px', borderBottomRightRadius: '4px' }}>
             
              </div>
            </div>

          )) : null}

      </div>
    );
  }
}

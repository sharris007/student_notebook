import React, { Component, PropTypes } from 'react';
import '../assets/temp.styl';



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
  width: '100px',
  height: '40px',
  color: 'grey'
};



export default class NoteBookHeader extends Component {
  static propTypes = {
    callback: PropTypes.func
  };




  constructor(props) {
    super(props);

    this.handleOnChange = this.handleOnChange.bind(this);
    // const lists = [...props.lists];

    this.state = {
      isScrolling: false,
      search: '',
      ider: null
    };



  }


 

 


  handleOnChange(event) {
    this.props.getLists(6);
    this.setState({ search: event.target.value });
  }

  handleGroupNotesButton(event) {
 //   this.props.groupMode();
    this.props.callback('GROUP', true);
  //  this.setState({ search: event.target.value });
  }

  render() {


debugger;



    //const { lists } = this.state;

    // const filteredList = lists.filter(list => {
    //   list.cards = list.cards.filter(card => {
    //     if (card.title || card.title === '') {
    //       return (card.title.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1);
    //     }
    //   });

    //   return true;
    // });

    return (
      <div>
        <table>
          <tbody>
            <tr>
              <td>
                <button style={buttonAllStyle}>All</button>
              </td>
              <td>
                <VerticalLine></VerticalLine>
              </td>
              <td>
                <button style={buttonStyles}>Chapters</button>
              </td>
              <td>
                <button style={buttonStyles}>Labels</button>
              </td>
              <td style={{ width: '68%' }}>
                <button style={buttonGroupStyle} onClick={() => this.handleGroupNotesButton()}>Group notes</button>
              </td>
            </tr>
          </tbody>

        </table>
      </div>
    );
  }
}

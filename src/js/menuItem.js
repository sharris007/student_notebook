import React, { Component } from 'react';
import '../assets/temp.styl';
import '../scss/notebook.scss';
const listStyle = {
  padding : '10px 10px 10px 28px'
};

export default class MenuItem extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount = () => {
   // this.makeCheckboxAschecked(JSON.parse(localStorage.getItem('chapterItem')));
   // this.makeCheckboxAschecked(JSON.parse(localStorage.getItem('labelItem')));
  }

  makeCheckboxAschecked = (getCheckedVal) => {
    if ( (getCheckedVal != null && (getCheckedVal.length > 0))) {
      for (let i=0;i<getCheckedVal.length;i++) {
        if ( document.getElementById(getCheckedVal[i]) ) {
          document.getElementById(getCheckedVal[i]).checked = true;
        }
      }
    }
  }

  getSelctedVal = (e, labelFlag) => {
    let checkboxes;
    if (labelFlag) {
      const getAllLabelcheckBox = document.querySelectorAll('.select-box.label');
      // if (e.target.id === 'all-label') {
      //   this.enableAllTypeChekbox(getAllLabelcheckBox, e.target.id);
      //   checkboxes = document.getElementById(e.target.id);
      // }
      // else{
      //   document.getElementById('all-label').checked = false;
      //   checkboxes = getAllLabelcheckBox;
      // }
      this.getCheckedboxval(getAllLabelcheckBox, true);
    }
    else {
      const getAllcheckboxes = document.getElementsByClassName('select-box');
      if (e.target.id === 'All') {
        this.enableAllTypeChekbox(getAllcheckboxes, e.target.id);
        checkboxes = document.getElementById(e.target.id);
      }
      else { 
        document.getElementById('All').checked = false;
        checkboxes = getAllcheckboxes;
      }
      this.getCheckedboxval(checkboxes);
    }
  }
 
  enableAllTypeChekbox = (getAllLabelcheckBox, id) => {
    document.getElementById(id).checked = true;
    this.unselectCheckBox(getAllLabelcheckBox, id);
  }

  getCheckedboxval = (checkboxes, isLabelEle) => {
    let val = '';
    const itemArr = [];
    for (let i=0, n=checkboxes.length;i<n;i++) 
    {
      if (checkboxes[i].checked) 
      {
        val = checkboxes[i].id;
        itemArr.push(checkboxes[i].id);
      }
    }
    if (val) {
      // val = val.substring(1); 
      this.formArrayVal(isLabelEle, itemArr);
      
    }
    else {
      this.formArrayVal(isLabelEle, []);
    }
    this.props.getSelectedVal(JSON.parse(localStorage.getItem('chapterItem')), JSON.parse(localStorage.getItem('labelItem')));
  }

  formArrayVal = (flag, itemArr) => {
    if (flag) {
      localStorage.setItem('labelItem', JSON.stringify(itemArr));
    }
    else {
      localStorage.setItem('chapterItem', JSON.stringify(itemArr));
    }
  }
  
  allTypeChckBox = () => {
    document.getElementById('All').checked = false;
  }

  unselectCheckBox = (checkboxes, id) => {
    for (let i=0, n=checkboxes.length;i<n;i++) 
    {
      if ( checkboxes[i].id !== id ) {
        document.getElementsByClassName('select-box')[i].checked = false;
      }
      
    }
  }

  render() {
    this.props.labelCode ? this.props.labelCode : '';
    if (this.props.labelCode) {
      return (
        <div className="listbox label" >
        <input className={`select-box label ${this.props.labelCode}`} id={this.props.content.labelCode} type="checkbox" value={this.props.label} onClick= { (e) => this.getSelctedVal(e,true)}/ >
        <label htmlFor={this.props.content.labelCode} >{this.props.label}</label>
        </div>
      );
    }
    else {
      return (
        <div className="listbox" style={listStyle}>
        <input className={`select-box ${this.props.labelCode}`} id={this.props.content.id} type="checkbox" value={this.props.label} onClick= { (e) => this.getSelctedVal(e)}/ >
        <label htmlFor={this.props.content.id} >{this.props.label}</label>
        </div>
      );
    }
    
  }
}

import React, { Component } from 'react';
import '../assets/temp.styl';
import '../scss/notebook.scss';
const listStyle = {
  padding : '10px'
};

export default class MenuItem extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount = () => {
    this.makeCheckboxAschecked(JSON.parse(localStorage.getItem('chapterItem')));
    this.makeCheckboxAschecked(JSON.parse(localStorage.getItem('labelItem')));
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
      checkboxes = document.querySelectorAll('.select-box.label');
      this.getCheckedboxval(checkboxes, true);
    }
    else {
      const getAllcheckboxes = document.getElementsByClassName('select-box');
      if (e.target.id === 'All') {
        document.getElementById(e.target.id).checked = true;
        checkboxes = document.getElementById(e.target.id);
        this.makeCheckboxAschecked(getAllcheckboxes, e.target.id);
      }
      else { 
        document.getElementById('All').checked = false;
        checkboxes = getAllcheckboxes;
      }
      this.getCheckedboxval(checkboxes);
    }
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

  makeCheckboxAschecked = (checkboxes, id) => {
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
        <div className="listbox" style={listStyle}>
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
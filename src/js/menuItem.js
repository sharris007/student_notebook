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

  getSelctedVal = (e, labelFlag) => {
    let checkboxes;
    if (labelFlag) {
      const getAllLabelcheckBox = document.querySelectorAll('.select-box.label');
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
    this.props.getSelectedVal(JSON.parse(localStorage.getItem('lastUsedFilters')));
  }

  formArrayVal = (flag, itemArr) => {
    const filterArray = localStorage.getItem('lastUsedFilters') ? JSON.parse(localStorage.getItem('lastUsedFilters')) : { 'noteType' : [], 'chapterId' : []};
    if (flag) {
      filterArray.noteType = itemArr;
    }
    else {
      filterArray.chapterId = itemArr;
    } 
    localStorage.setItem('lastUsedFilters', JSON.stringify(filterArray));
    
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
        <label htmlFor={this.props.content.labelCode} ><span style={{'display':'block','paddingLeft':'30px'}}>{this.props.label}</span></label>
        </div>
      );
    }
    else {
      return (
        <div className="listbox" style={listStyle}>
        <input className={`select-box ${this.props.labelCode}`} id={this.props.content.id} type="checkbox" value={this.props.label} onClick= { (e) => this.getSelctedVal(e)}/ >
        <label htmlFor={this.props.content.id} ><span style={{'display':'block','paddingLeft':'30px'}}>{this.props.label}</span></label>
        </div>
      );
    }
    
  }
}
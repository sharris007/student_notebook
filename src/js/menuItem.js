import React, { Component, PropTypes } from 'react';
import '../assets/temp.styl';
import '../scss/notebook.scss';
const listStyle = {
  padding : '10px'
}

export default class MenuItem extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount = () => {
    this.makeCheckboxAschecked(JSON.parse(localStorage.getItem('chapterItem')));
    this.makeCheckboxAschecked(JSON.parse(localStorage.getItem('labelItem')));
  }

  makeCheckboxAschecked = (getCheckedVal) => {
    if( (getCheckedVal != null && (getCheckedVal.length > 0))){
      for (let i=0;i<getCheckedVal.length;i++) {
        if( document.getElementById(getCheckedVal[i]) ){
          document.getElementById(getCheckedVal[i]).checked = true;
        }
      }
    }
  }

  getSelctedVal = (e, labelFlag) => {
      let checkboxes;
      if(labelFlag){
        checkboxes = document.querySelectorAll('.select-box.label');
        this.getCheckedboxval(checkboxes, true);
      }
      else{
        checkboxes = document.getElementsByClassName('select-box');
        this.getCheckedboxval(checkboxes);
      }
      
  }

  getCheckedboxval = (checkboxes, isLabelEle) => {
    let val = "";
    const itemArr = [];
    for (let i=0, n=checkboxes.length;i<n;i++) 
    {
        if (checkboxes[i].checked) 
        {
            val = checkboxes[i].id;
            itemArr.push(checkboxes[i].id);
        }
    }
    console.log("itemArr", itemArr);
    if (val) { 
      // val = val.substring(1); 
      console.log(val);
      if(isLabelEle){
        localStorage.setItem('labelItem', JSON.stringify(itemArr));
      }
      else{
        localStorage.setItem('chapterItem', JSON.stringify(itemArr));
      }
      
    }
    else{
      localStorage.setItem('chapterItem', JSON.stringify([]));
      localStorage.setItem('labelItem', JSON.stringify([]));
    }
    this.props.getSelectedVal(JSON.parse(localStorage.getItem('chapterItem')) , JSON.parse(localStorage.getItem('labelItem')));
  }

  render() {
    this.props.labelCode ? this.props.labelCode : '';
    if(this.props.labelCode){
      return (
        <div className="listbox" style={listStyle} >
        <input className={`select-box label ${this.props.labelCode}`} id={this.props.content.labelCode} type="checkbox" value={this.props.label} onClick= { (e) => this.getSelctedVal(e,true)}/ >
        <label htmlFor={this.props.content.labelCode} >{this.props.label}</label>
        </div>
      )
    }
    else{
      return (
        <div className="listbox" style={listStyle} >
        <input className={`select-box ${this.props.labelCode}`} id={this.props.content.id} type="checkbox" value={this.props.label} onClick= { (e) => this.getSelctedVal(e)}/ >
        <label htmlFor={this.props.content.id} >{this.props.label}</label>
        </div>
      )
    }
    
  }
}

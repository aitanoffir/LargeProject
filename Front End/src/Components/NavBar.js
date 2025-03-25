import React from 'react';
import "../App.css";
import {NavBarData} from './NavBarData';

function NavBar() {
    
  return (
  <div className = "NavBar">
    <ul className = "NavBarList">
        {NavBarData.map((val, key) => {
            return( 
            <li 
                key = {key} 
                className = "row"
                id = {window.location.pathname == val.link ? "active" : "" }
                onClick = {()=> {
                window.location.pathname = val.link;
                }}
                > 
                    {" "}
                    <div>{val.icon}</div>{" "} <div>{val.title}</div>
            </li>
            );
        })}
    </ul>
  </div>
  );
}

export default NavBar;
import React from 'react'
import {Col} from 'react-bootstrap'

function contentCol(props){
  const colStyles = {
    color: "white",
    display: "flex",
    flexDirection: "column",
    marginBottom: "0em"
  }

  return (
    <Col style={colStyles}>
      <h3>{props.title}</h3>
      <div className={`contentDiv ${props.padding ? "col-pad": ""}`}>
        {'subtitle' in props && 
          <div>
            <h4>{props.subtitle}</h4>
            <hr style={{backgroundColor: "white"}}></hr>
          </div>
        }
        {props.children}
      </div>
    </Col>
  );
}

export default contentCol;
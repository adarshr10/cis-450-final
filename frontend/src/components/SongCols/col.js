import React from 'react'
import {Col} from 'react-bootstrap'

function contentCol(props){
  const colStyles = {
    color: "white",
    display: "flex",
    flexDirection: "column",
    marginBottom: "1em"
  }

  const divStyles = {
    height: props.height || "80vh",
  }

  return (
    <Col style={colStyles}>
      <h3>{props.title}</h3>
      <div className={`${props.className || "contentDiv"} ${props.padding && "col-pad"}`} style={divStyles}>
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
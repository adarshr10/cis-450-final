import React from 'react'
import {Col, Table} from 'react-bootstrap'

function ContentCol(props){
  const colStyles = {
    overflowY: "auto",
    overflowX: "hidden",
    height: "350px",
    border: "1px solid #b3b3b3"
  }

  return (
    <Col sm={6} lg={3} style={{marginBottom: "1.25rem"}}>
      <div style={colStyles} className="homeColScroll">
      <Table borderless responsive="sm">
        <tbody>
          <tr className='headerRow'>
            <th>#</th>
            <th>{props.name}</th>
            <th>%</th>
          </tr>
          {props.children}
        </tbody>
      </Table>
      </div>
    </Col>
  );
}

export default ContentCol;
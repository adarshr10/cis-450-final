/* Component representing the sidebar */

import React from 'react'
import Nav from 'react-bootstrap/Nav'
import '../style/Sidebar.css';
import {Link} from 'react-router-dom'

// takes in current page as an argument (e.g. '/' or '/search')
const Sidebar = ({curPage}) => {

    return (
        <div className="sidebar flex-column sidebarContainer">
            <Nav variant="pills" activeKey={curPage} className="flex-column">
                <Nav.Item>
                    <Nav.Link eventKey="/" as={Link} to="/">Home</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="/search" as={Link} to="/search">Search</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="/song" as={Link} to="/song">Song</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="/lyric" as={Link} to="/lyric">Lyric</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="/genre" as={Link} to="/genre">Genre</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="/artist" as={Link} to="/artist">Artist</Nav.Link>
                </Nav.Item>
            </Nav>
        </div>
    )
}

export default Sidebar;
/* Component representing the sidebar */

import React from 'react'
import Nav from 'react-bootstrap/Nav'
import '../style/Sidebar.css';

// takes in current page as an argument (e.g. '/' or '/search')
const Sidebar = ({curPage}) => {

    return (
        <div className="sidebar flex-column sidebarContainer">
            <Nav variant="pills" defaultActiveKey={curPage} className="flex-column">
                <Nav.Item>
                    <Nav.Link href="/">Home</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="/search">Search</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="/timeline">Timeline</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="/song">Song</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="/lyric">Lyric</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="/genre">Genre</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="/artist">Artist</Nav.Link>
                </Nav.Item>
            </Nav>
        </div>
    )
}

export default Sidebar;
import React , { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

export default function DirectoriesDropdownMenu() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    
    function toggle() {
        setDropdownOpen(!dropdownOpen);
    }

    function onMouseEnter() {
        setDropdownOpen(true);
    }

    function onMouseLeave() {
        setDropdownOpen(false);
    }

    return (
        <>
            <Dropdown id="dropdown-basic-button" onMouseOver={onMouseEnter} onMouseLeave={onMouseLeave} isOpen={dropdownOpen} toggle={toggle}>
                <DropdownToggle caret>
                    Directories
                </DropdownToggle>
                <DropdownMenu>
                    <DropdownItem href="#/action-1">Library books</DropdownItem>
                    <DropdownItem tag={Link} to='/registration/list/people'>All people</DropdownItem>
                    <DropdownItem tag={Link} to='/registration/list/grades'>All grades</DropdownItem>
                    <DropdownItem href="#/action-3">All classes</DropdownItem>
                    <DropdownItem href="#/action-3">Active students by name</DropdownItem>
                    <DropdownItem href="#/action-3">Manual transactions from last two school years</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </>
    );
};
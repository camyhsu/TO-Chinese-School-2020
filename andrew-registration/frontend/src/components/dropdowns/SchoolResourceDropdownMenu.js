import React , { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../libs/contextLib';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

export default function SchoolResourceDropdownMenu() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { schoolYear } = useAppContext();
    
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
                <DropdownToggle>
                    {schoolYear.name} Resources
                </DropdownToggle>
                <DropdownMenu>
                    <DropdownItem tag={Link} to='/registration/list/studentcount/class'>{schoolYear.name} 班級人數清單</DropdownItem>
                    <DropdownItem tag={Link} to='/registration/list/studentcount/elective'>{schoolYear.name} Elective 人數清單</DropdownItem>
                    <DropdownItem tag={Link} to='/registration/list/studentcount/grades'>{schoolYear.name} 年級人數清單</DropdownItem>
                    <DropdownItem tag={Link} to='/registration/list/classes/active'>{schoolYear.name} Active School Classes</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </>
    );
};
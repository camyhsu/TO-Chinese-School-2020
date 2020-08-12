import React , { useState } from 'react';
import { useAppContext } from '../../libs/contextLib';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

export default function AdministrativeTasksDropdownMenu() {
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
                    Administrative Tasks
                </DropdownToggle>
                <DropdownMenu>
                    <DropdownItem href="#/action-1">{schoolYear.name} Online Resgistration Summary</DropdownItem>
                    <DropdownItem href="#/action-2">Student's Previous Final Marks</DropdownItem>
                    <DropdownItem href="#/action-3">Registration Integrity Report</DropdownItem>
                    <DropdownItem href="#/action-3">Sibling in Same Grade Report</DropdownItem>
                    <DropdownItem href="#/action-1">In-Person Registration Payments</DropdownItem>
                    <DropdownItem href="#/action-2">Withdraw Requests</DropdownItem>
                    <DropdownItem href="#/action-3">Manage Track Events</DropdownItem>
                    <DropdownItem href="#/action-3">Randomly Assign Students to grade class</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </>
    );
};
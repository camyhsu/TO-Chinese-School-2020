import React , { useState } from 'react';
import { useAppContext } from '../../libs/contextLib';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

export default function DownloadablesDropdownMenu() {
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
                <DropdownToggle caret>
                    Downloadables
                </DropdownToggle>
                <DropdownMenu>
                    <DropdownItem href="#/action-3">Student list by name</DropdownItem>
                    <DropdownItem href="#/action-1">Student list by class</DropdownItem>
                    <DropdownItem href="#/action-2">Student list by grade</DropdownItem>
                    <DropdownItem href="#/action-3">fire drill form</DropdownItem>
                    <DropdownItem href="#/action-1">班級人數清單class student count csv</DropdownItem>
                    <DropdownItem href="#/action-2">Elective 人數清單 elective student count csv</DropdownItem>
                    <DropdownItem href="#/action-2">{schoolYear.name} student final marks csv</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </>
    );
};
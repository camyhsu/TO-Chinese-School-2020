import React from 'react';
import SchoolResourceDropdownMenu from './dropdowns/SchoolResourceDropdownMenu';
import AdministrativeTasksDropdownMenu from './dropdowns/AdministrativeTasksDropdownMenu';
import DownloadablesDropdownMenu from './dropdowns/DownloadablesDropdownMenu';
import DirectoriesDropdownMenu from './dropdowns/DirectoriesDropdownMenu';

export default function RegistrationNavBar() {

    return (
        <>
            <ul id="dd-wrapper">
                <li>
                    <SchoolResourceDropdownMenu />
                </li>
                <li>
                    <AdministrativeTasksDropdownMenu />
                </li>
                <li>
                    <DirectoriesDropdownMenu />
                </li>
                <li>
                    <DownloadablesDropdownMenu />
                </li>
            </ul>
        </>
    )
};
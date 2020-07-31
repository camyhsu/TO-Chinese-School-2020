import React from 'react';
import SchoolResourceDropdownMenu from './SchoolResourceDropdownMenu';
import AdministrativeTasksDropdownMenu from './AdministrativeTasksDropdownMenu';
import DownloadablesDropdownMenu from './DownloadablesDropdownMenu';
import DirectoriesDropdownMenu from './DirectoriesDropdownMenu';

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
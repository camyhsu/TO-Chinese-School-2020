import React , {Component} from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

export default class AdministrativeTasksDropdownMenu extends Component {
    constructor(props) {
        super(props);
    
        this.toggle = this.toggle.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.state = {
          dropdownOpen: false
        };
      }
    
      toggle() {
        this.setState(prevState => ({
          dropdownOpen: !prevState.dropdownOpen
        }));
      }
    
      onMouseEnter() {
        this.setState({dropdownOpen: true});
      }
    
      onMouseLeave() {
        this.setState({dropdownOpen: false});
      }

      render() {
        return (
            <>
                <Dropdown id="dropdown-basic-button" onMouseOver={this.onMouseEnter} onMouseLeave={this.onMouseLeave} isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                    <DropdownToggle>
                        Administrative Tasks
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem href="#/action-1">2020-2021 Online Resgistration Summary</DropdownItem>
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
      }
}
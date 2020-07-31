import React , {Component} from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

export default class DownloadablesDropdownMenu extends Component {
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
                        <DropdownItem href="#/action-2">2020-2021 student final marks csv</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </>
        );
      }
}
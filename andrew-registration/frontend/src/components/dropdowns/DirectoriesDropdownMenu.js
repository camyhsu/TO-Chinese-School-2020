import React , {Component} from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

export default class DirectoriesDropdownMenu extends Component {
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
      }
}
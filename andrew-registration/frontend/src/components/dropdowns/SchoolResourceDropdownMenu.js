import React , {Component} from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

export default class SchoolResourceDropdownMenu extends Component {
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
                        2020-2021 Resources
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem tag={Link} to='/registration/list/studentcount/class'>2020-2021 班級人數清單</DropdownItem>
                        <DropdownItem tag={Link} to='/registration/list/studentcount/elective'>2020-2021 Elective 人數清單</DropdownItem>
                        <DropdownItem tag={Link} to='/registration/list/studentcount/grades'>2020-2021 年級人數清單</DropdownItem>
                        <DropdownItem tag={Link} to='/registration/list/classes/active'>2020-2021 active school classes</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </>
        );
      }
}
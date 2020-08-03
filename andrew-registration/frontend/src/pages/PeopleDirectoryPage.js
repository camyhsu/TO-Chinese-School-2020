import React, { Component  } from 'react';
import { Link } from 'react-router-dom';


const Result = ({hasSearched, results}) => {
    if( !hasSearched ) {
        return null;
    }
    if( Object.keys(results).length === 0 ) {
        return <h3>No results found</h3>;
    }
    return (
        <>
            <br></br>
            <center>
                <table id="people">
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Chinese Name</th>
                            <th>Email</th>
                            <th>Gender</th>
                            <th>Birth Month</th>
                            <th>Birth Year</th>
                            <th>Native Language</th>
                        </tr>
                    </thead>
                    {results.map((entry, key) => (
                        <tbody key={key}>
                            <tr>
                                <td>{entry.english_first_name}</td>
                                <td>{entry.english_last_name}</td>
                                <td>{entry.chinese_name}</td>
                                <td>{entry.email}</td>
                                <td>{entry.gender}</td>
                                <td>{entry.birth_month}</td>
                                <td>{entry.birth_year}</td>
                                <td>{entry.native_language}</td>
                                <td id="show-details"><Link to="#/action1">Show Details</Link></td>
                            </tr>
                        </tbody>
                    ))}
                </table>
            </center>
        </>
    )
}

const Search = (props) => {
    const {
        selectedOption,
        searchQuery,
        onChange,
        onTextChange,
        handleFormSubmit,
    } = props;

    return (
        <>
            <h1>Directory Search</h1>
            <form onSubmit={handleFormSubmit}>
                <div className="radio">
                    <label>
                        <input type="radio" value="email" checked={selectedOption === 'email'} onChange={onChange} />
                        Email
                    </label>
                    <label>
                        <input type="radio" value="english" checked={selectedOption === 'english'} onChange={onChange}/>
                        English Name
                    </label>
                    <label>
                        <input type="radio" value="chinese" checked={selectedOption === 'chinese'} onChange={onChange}/>
                        Chinese Name
                    </label>
                </div>
                <br></br>
                <input type="text" value={searchQuery} onChange={onTextChange} />
                <button type="search">Search</button>
            </form>
        </>
    )
}

export default class PeopleDirectoryPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hasSearched: false,
            selectedOption: 'email',
            searchQuery: '',
            results: [],
        };
        this.onChange = this.onChange.bind(this);
        this.onTextChange = this.onTextChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);

      }
    
    onChange = function (changeEvent) {
        this.setState({selectedOption: changeEvent.target.value});
    }

    onTextChange = function (changeEvent) {
        this.setState({searchQuery: changeEvent.target.value});
    }

    handleFormSubmit = function (formSubmitEvent) {
        formSubmitEvent.preventDefault();
        this.setState({hasSearched: true});
        const fetch = require("node-fetch");
        var json = null;

        const fetchData = async () => {
            // fetch people data by email
            if( this.state.selectedOption === "email" ) {
                let email = this.state.searchQuery.trim();
                try {
                    const response = await fetch(`/people/email/${email}`);
                    json = await response.json();
                    this.setState({results: json});
                } catch (error) {
                    console.log(error);
                }
            }
            // fetch people data by english name
            else if( this.state.selectedOption === "english" ) {
                let name  = this.state.searchQuery.replace(/\s/g, '').trim();
                try {
                    const response = await fetch(`/people/englishName/${name}`);
                    json = await response.json();
                    this.setState({results: json});
                } catch (error) {
                    console.log(error);
                }
            }
            // fetch people data by chinese name
            else {
                let name = this.state.searchQuery.replace(/\s/g, '').trim();
                try {
                    const response = await fetch(`/people/chineseName/${name}`);
                    json = await response.json();
                    this.setState({results: json});
                } catch (error) {
                    console.log(error);
                }
            }
        };
        fetchData();
    }

    render() {
        const {hasSearched, selectedOption, searchQuery, results} = this.state;

        return (
            <>
                <Search selectedOption={selectedOption}
                        searchQuery={searchQuery}
                        onChange={this.onChange}
                        onTextChange={this.onTextChange}
                        handleFormSubmit={this.handleFormSubmit}/>
                <Result hasSearched={hasSearched} results={results}/>
            </>
        )
    }
 };
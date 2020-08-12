import React, { Component } from 'react';

export default class GradesDirectoryPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            results: [],
        };
    }

    componentDidMount() {
        const fetchData = async () => {
            try {
                const response = await fetch(`/directories/grades`);
                var json = await response.json();
                this.setState({results: json});
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }

    render() {
        return (
            <>
                <h3>Grades</h3>
                <br></br>
                <center>
                    <table id="grades">
                        <thead>
                            <tr>
                                <th>Chinese Name</th>
                                <th>English Name</th>
                                <th>Short Name</th>
                            </tr>
                        </thead>
                        {this.state.results.map((entry, key) => (
                            <tbody key={key}>
                                <tr>
                                    <td>{entry.chinese_name}</td>
                                    <td>{entry.english_name}</td>
                                    <td>{entry.short_name}</td>
                                </tr>
                            </tbody>
                        ))}
                    </table>
                </center>
                
            </>
        )
        
    }
};
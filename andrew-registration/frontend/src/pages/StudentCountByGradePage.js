import React, { Component } from 'react';

export default class StudentCountByGradePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            results: [],
        };
    }

    componentDidMount() {
        const fetchData = async () => {
            try {
                // psql db is not up to date so using previous year's id
                const response = await fetch(`/directories/studentcount/grades/${'14'}`);
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
                <h3>千橡中文學校 2020-2021學年度 年級人數清單</h3>
                <br></br>
                <center>
                    <table>
                        <thead>
                            <tr>
                                <th>年級 (Grade)</th>
                                <th>人數 (Count)</th>
                                <th>Maximum Size</th>
                            </tr>
                        </thead>
                        {this.state.results.map((entry, key) => (
                            <tbody key={key}>
                                <tr>
                                    <td>{entry.chinese_name} ({entry.english_name})</td>
                                    <td>{entry.count}</td>
                                    <td>{entry.max}</td>
                                </tr>
                            </tbody>
                        ))}
                    </table>
                </center>
                
            </>
        )
        
    }
};
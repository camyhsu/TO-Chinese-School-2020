import React, { Component } from 'react';

//TO-DO: Add functionality to click on people names to redirect to profile page and student list

export default class ActiveClassPage extends Component {
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
                const response = await fetch(`/directories/classes/active/${'14'}`);
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
                <h3>2020-2021 Active Classes</h3>
                <br></br>
                <center>
                    <table>
                        <thead>
                            <tr>
                                <th>Chinese Name</th>
                                <th>English Name</th>
                                <th>Location</th>
                                <th>Primary Instructor</th>
                                <th>Room Parent</th>
                                <th>Secondary Instructor</th>
                                <th>Teaching Assistant</th>
                            </tr>
                        </thead>
                        {this.state.results.map((entry, key) => (
                            <tbody key={key}>
                                <tr>
                                    <td>{entry.class_chinese_name}</td>
                                    <td>{entry.class_english_name}</td>
                                    <td>{entry.location}</td>
                                    {entry.teacher_chinese_name == null && entry.teacher_first_name == null && entry.teacher_last_name == null ? <
                                        td></td> : <td>{entry.teacher_chinese_name} ({entry.teacher_first_name} {entry.teacher_last_name})</td> }
                                    {entry.parent_chinese_name == null && entry.parent_first_name == null && entry.parent_last_name == null ? <
                                        td></td> : <td>{entry.parent_chinese_name} ({entry.parent_first_name} {entry.parent_last_name})</td> }
                                    {entry.teacher2_chinese_name == null && entry.teacher2_first_name == null && entry.teacher2_last_name == null ? <
                                        td></td> : <td>{entry.teacher2_chinese_name} ({entry.teacher2_first_name} {entry.teacher2_last_name})</td> }
                                    {entry.ta_chinese_name == null && entry.ta_first_name == null && entry.ta_last_name == null ? <
                                        td></td> : <td>{entry.ta_chinese_name} ({entry.ta_first_name} {entry.ta_last_name})</td> }
                                    <td>Student List</td>
                                </tr>
                            </tbody>
                        ))}
                    </table>
                </center>
                
            </>
        )
        
    }
};
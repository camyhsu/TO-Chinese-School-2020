import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../libs/contextLib';
import { Link } from 'react-router-dom';

//TO-DO: Add functionality to click on people names to redirect to profile page and student list

export default function ActiveClassPage() {
    const [results, setResults] = useState([]);
    const { schoolYear } = useAppContext();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/directories/classes/active/${schoolYear.id}`);
                var json = await response.json();
                setResults(json);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [schoolYear.id])

    return (
        <>
            <h3>{schoolYear.name} Active Classes</h3>
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
                    {results.map((entry, key) => (
                        <tbody key={key}>
                            <tr>
                                <td>{entry.class_chinese_name}</td>
                                <td>{entry.class_english_name}</td>
                                <td>{entry.location}</td>
                                {entry.teacher_chinese_name == null && entry.teacher_first_name == null && entry.teacher_last_name == null ? <td></td> : 
                                    <td>
                                        <Link to={{pathname: `/registration/people/profile/${entry.teacher_id}`}}>
                                            {entry.teacher_chinese_name} ({entry.teacher_first_name} {entry.teacher_last_name})
                                        </Link>
                                    </td> }
                                {entry.parent_chinese_name == null && entry.parent_first_name == null && entry.parent_last_name == null ? <td></td> : 
                                    <td>
                                        <Link to={{pathname: `/registration/people/profile/${entry.parent_id}`}}>
                                            {entry.parent_chinese_name} ({entry.parent_first_name} {entry.parent_last_name})
                                        </Link>
                                    </td> }
                                {entry.teacher2_chinese_name == null && entry.teacher2_first_name == null && entry.teacher2_last_name == null ? <td></td> : 
                                    <td>
                                        <Link to={{pathname: `/registration/people/profile/${entry.teacher2_id}`}}>
                                            {entry.teacher2_chinese_name} ({entry.teacher2_first_name} {entry.teacher2_last_name})
                                        </Link>
                                    </td> }
                                {entry.ta_chinese_name == null && entry.ta_first_name == null && entry.ta_last_name == null ? <td></td> : 
                                    <td>
                                        <Link to={{pathname: `/registration/people/profile/${entry.ta_id}`}}>
                                            {entry.ta_chinese_name} ({entry.ta_first_name} {entry.ta_last_name})
                                        </Link>
                                    </td> }
                                <td><Link to={{pathname: `/registration/list/studentlist/class/${entry.id}`}}>Student List</Link></td>
                            </tr>
                        </tbody>
                    ))}
                </table>
            </center>
        </>
    )
};
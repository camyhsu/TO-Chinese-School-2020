import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../libs/contextLib';

export default function ActiveStudentsPage() {
    const[results, setResults] = useState([]);
    const { schoolYear } = useAppContext();
    const d = new Date();
    const date = String(d.getMonth()+1).padStart(2,'0') + '/' + String(d.getDate()+1).padStart(2,'0') + '/' + d.getFullYear();
    const time = d.getHours() + ':' + d.getMinutes();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/directories/activestudents?year=${schoolYear.id}`);
                console.log(response);
                if( response.status === 200 ) {
                    var json = await response.json();
                    setResults(json);
                }
                else {
                    alert('Failed to get student count by class. Please try again.');
                }
                
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [schoolYear.id])

    return (
        <>
            <h3>Active Students for {schoolYear.name}</h3>
            <br></br>
            <center>
                <table>
                    <thead>
                        <tr>
                            <th>Last Name</th>
                            <th>First Name</th>
                            <th>姓名</th>
                            <th>班級</th>
                            <th>教室</th>
                            <th colspan="2">第三堂選修課</th>
                        </tr>
                    </thead>
                    {results.map((entry, key) => (
                        <tbody key={key}>
                            <tr>
                                <td>{entry.last_name}</td>
                                <td>{entry.first_name}</td>
                                <td>{entry.chinese_name}</td>
                                <td>{entry.class_name}</td>
                                <td>{entry.class_loc}</td>
                                <td>{entry.elective_name}</td>
                                <td>{entry.elective_loc}</td>
                            </tr>
                        </tbody>
                    ))}
                </table>
            </center>
            <p>Total count: {results.length}</p>
            <p>As of: {date} {time}</p>
        </>
    )
};
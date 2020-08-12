import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../libs/contextLib';

export default function StudentCountByClassPage() {
    const[results, setResults] = useState([]);
    const { schoolYear } = useAppContext();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // psql db is not up to date so using previous year's id
                const response = await fetch(`/directories/studentcount/class/${schoolYear.id}`);
                var json = await response.json();
                setResults(json);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    })

    return (
        <>
            <h3>千橡中文學校 {schoolYear.name}學年度 班級人數清單</h3>
            <br></br>
            <center>
                <table>
                    <thead>
                        <tr>
                            <th>年級 (Grade)</th>
                            <th>人數 (Count)</th>
                            <th>教室 (Room)</th>
                            <th>老師 (Teacher)</th>
                            <th>Room Parent</th>
                            <th>Maximum Size</th>
                            <th>Minimum Age</th>
                            <th>Maximum Age</th>
                        </tr>
                    </thead>
                    {results.map((entry, key) => (
                        <tbody key={key}>
                            <tr>
                                <td>{entry.class_chinese_name} ({entry.class_english_name})</td>
                                <td>{entry.count}</td>
                                <td>{entry.location}</td>
                                <td>{entry.teacher_chinese_name} ({entry.teacher_first_name} {entry.teacher_last_name})<br></br>{entry.teacher_email}<br></br>{entry.teacher_phone}</td>
                                {entry.parent_chinese_name == null && entry.parent_first_name == null && entry.parent_last_name == null ? <
                                    td></td> : <td>{entry.parent_chinese_name} ({entry.parent_first_name} {entry.parent_last_name}) {entry.parent_email} {entry.parent_phone}</td> }
                                <td>{entry.max_size}</td>
                                <td>{entry.min_age}</td>
                                <td>{entry.max_age}</td>
                            </tr>
                        </tbody>
                    ))}
                </table>
            </center>
        </>
    )
};
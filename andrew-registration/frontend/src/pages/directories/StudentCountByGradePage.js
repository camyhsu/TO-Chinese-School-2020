import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../libs/contextLib';

export default function StudentCountByGradePage() {
    const [results, setResults] = useState([]);
    const { schoolYear } = useAppContext();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // psql db is not up to date so using previous year's id
                const response = await fetch(`/directories/studentcount/grades/${schoolYear.id}`);
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
            <h3>千橡中文學校 {schoolYear.name}學年度 年級人數清單</h3>
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
                    {results.map((entry, key) => (
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
};
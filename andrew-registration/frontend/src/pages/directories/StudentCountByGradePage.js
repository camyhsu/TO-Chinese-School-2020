import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../libs/contextLib';

export default function StudentCountByGradePage() {
    const [results, setResults] = useState([]);
    const { schoolYear } = useAppContext();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/directories/studentcount/grades?id=${schoolYear.id}`);
                if ( response.status === 200 ) {
                    var json = await response.json();
                    setResults(json);
                }
                else {
                    alert('Failed to get student count by grade. Please try again.');
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [schoolYear.id])

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
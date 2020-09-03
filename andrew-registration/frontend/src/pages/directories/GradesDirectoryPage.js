import React, { useState, useEffect } from 'react';

export default function GradesDirectoryPage() {
    const [results, setResults] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/directories/grades`);
                if( response.status === 200 ) {
                    var json = await response.json();
                    setResults(json);
                }
                else {
                    alert('Failed to get grade information. Please try again.');
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [])

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
                    {results.map((entry, key) => (
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
};
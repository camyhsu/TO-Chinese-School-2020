import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../libs/contextLib';
import { Button } from 'reactstrap';

export default function ActiveClassPage() {
    const [results, setResults] = useState([]);
    const { schoolYear } = useAppContext();

    const fetchData = async () => {
        try {
            const response = await fetch(`/directories/classes/all?id=${schoolYear.id}`);
            var json = await response.json();
            setResults(json);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, []);

    const onClick = async (value, key) => {
        let body = {
            active: value === 'Disable' ? false : true
        }
        await fetch(`/admin/class/active/edit/${schoolYear.id}/${results[key].id}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'PATCH',                                                              
            body: JSON.stringify( body )                                        
        });
        fetchData();
    }

    return (
        <>
            <h3>All School Classes</h3>
            <br></br>
            <center>
                <table>
                    <thead>
                        <tr>
                            <th>Chinese Name</th>
                            <th>English Name</th>
                            <th>Short Name</th>
                            <th>Description</th>
                            <th>Location</th>
                            <th>Type</th>
                            <th>Max Size</th>
                            <th>Min Age</th>
                            <th>Max Age</th>
                            <th>Grade</th>
                            <th>{schoolYear.name} Active?</th>                            
                        </tr>
                    </thead>
                    {results.map((entry, key) => (
                        <tbody key={key}>
                            <tr>
                                <td>{entry.chinese_name}</td>
                                <td>{entry.english_name}</td>
                                <td>{entry.short_name}</td>
                                <td>{entry.description}</td>
                                <td>{entry.location}</td>
                                <td>{entry.type}</td>
                                <td>{entry.max_size}</td>
                                <td>{entry.min_age}</td>
                                <td>{entry.max_age}</td>
                                <td>{entry.grade_id}</td>
                                {entry.active === true ? <td>Yes</td> : <td>No</td>}
                                {entry.active === true ? <td><Button onClick={() => onClick('Disable', key)}>Disable</Button></td> : <td><Button onClick={() => onClick('Enable', key)}>Enable</Button></td>}
                            </tr>
                        </tbody>
                    ))}
                </table>
            </center>
        </>
    )
};
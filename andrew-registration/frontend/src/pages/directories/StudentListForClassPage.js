import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../libs/contextLib';

export default function StudentListForClassPage() {
    const url = window.location.href.split("/");
    const classId = url[url.length-1];

    const [studentResults, setStudentResults] = useState([]);
    const [classResults, setClassResults] = useState([]);
    const { schoolYear } = useAppContext();
    const d = new Date();
    const date = String(d.getMonth()+1).padStart(2,'0') + '/' + String(d.getDate()+1).padStart(2,'0') + '/' + d.getFullYear();
    const time = d.getHours() + ':' + d.getMinutes();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const classInfoResponse = await fetch(`/directories/classinfo?class=${classId}&year=${schoolYear.id}`);
                if( classInfoResponse.status === 200 ) {
                    var classInfo = await classInfoResponse.json();
                    setClassResults(classInfo[0]);
                }
                else {
                    alert('Failed to get class information. Please try again.');
                }   

                const studentInfoResponse = await fetch(`/directories/studentlist?class=${classId}&year=${schoolYear.id}`);
                if( studentInfoResponse.status === 200 ) {
                    var studentInfo = await studentInfoResponse.json();
                    setStudentResults(studentInfo);
                }
                else {
                    alert('Failed to get student information. Please try again.');
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [classId, schoolYear.id])

    return (
        <>
            <h3>{classResults.teacher_chinese_name} ({classResults.teacher_first_name} {classResults.teacher_last_name}) 老師</h3>
            <h3>{classResults.class_name} 教室:{classResults.location}</h3>
            {classResults.rp_chinese_name == null && classResults.rp_first_name == null && classResults.rp_last_name == null ? 
                <h3>Room Parent:</h3> : <h3>Room Parent: {classResults.rp_chinese_name} ({classResults.rp_first_name} {classResults.rp_last_name})</h3> }
            <br></br>
            <center>
                <table>
                    <thead>
                        <tr>
                            <th>學生</th>
                            <th>Last</th>
                            <th>First</th>
                            {classResults.type === 'ELECTIVE' ? <th>班級</th> : null}
                            <th>生年月</th>
                            <th>性别</th>
                            <th>Parent 1</th>
                            <th>Parent 2</th>
                            <th>Email</th>
                            <th>電話</th>
                        </tr>
                    </thead>
                    {studentResults.map((entry, key) => (
                        <tbody key={key}>
                            <tr>
                                <td>{entry.student_chinese_name}</td>
                                <td>{entry.student_last_name}</td>
                                <td>{entry.student_first_name}</td>
                                {classResults.type === 'ELECTIVE' ? <td>{entry.short_name}</td> : null}
                                <td>{entry.birth_month}/{entry.birth_year}</td>
                                <td>{entry.gender}</td>
                                {entry.p1_chinese_name == null && entry.p1_first_name == null && entry.p1_last_name == null ? <
                                    td></td> : <td>{entry.p1_chinese_name} ({entry.p1_first_name} {entry.p1_last_name})</td> }
                                {entry.p2_chinese_name == null && entry.p2_first_name == null && entry.p2_last_name == null ? <
                                    td></td> : <td>{entry.p2_chinese_name} ({entry.p2_first_name} {entry.p2_last_name})</td> }
                                <td>{entry.email}</td>
                                <td>({entry.phone.slice(0,3)}) {entry.phone.slice(3,6)}-{entry.phone.slice(6)}</td>
                            </tr>
                        </tbody>
                    ))}
                </table>
            </center>
            <p>Total count: {studentResults.length}</p>
            <p>As of: {date} {time}</p>
        </>
    )
};
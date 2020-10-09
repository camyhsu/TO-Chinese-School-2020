import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../libs/contextLib';
import { Button } from 'reactstrap';

export default function RegistrationStudentPage() {
    const { schoolYear } = useAppContext();
    const registrationInfo = `<h3>Registration For ${schoolYear.name} School Year</h3><ul><li>School Grade Placement:</li><ul>\
            <li>A new student must be between the age of 4 to 16 to be eligible for registration and will be assigned to the age-appropriate grade at enrollment.</li>\
            <li>A returning student is automatically assigned to one grade higher than their previous grade at Thousand Oaks Chinese School.</li></ul>\
            <li>School/Language class type (available types may vary by grade):</li><ul><li><b>S</b> - Simplified Chinese (簡體中文)</li>\
            <li><b>T</b> - Traditional Chinese (繁體中文)</li><li><b>EC</b> - Everyday Chinese (實用中文)</li></ul>\
            <li>Elective class is only available for 1st grade and above. Seats are limited and availability for selection is on a first-come, first serve basis.</li>\
            <li>For additional information, please read Registration Overview and Refund Policy or contact registration@to-cs.org for any questions.</li></ul>`;
    const ageGradeAssignment = {4:1, 5:2, 6:3, 7:4, 8:5, 9:6, 10:7, 11:8, 12:9, 13:10, 14:11, 15:11, 16:11}; //age:grade
    const [studentRegistrationInfo, setStudentRegistrationInfo] = useState([]);
    const [electiveAvailability, setElectiveAvailability] = useState([]);
    const [grades, setGrades] = useState([]);
    const [elective, setElective] = useState();
    const [classType, setClassType] = useState();

    const fetchData = async () => {
        try {
            const studentResponse = await fetch(`/registration/student/info?id=486`);//${userData.family.familyId}`);
            if( studentResponse.status === 200 ) {
                var studentJson = await studentResponse.json();
                setStudentRegistrationInfo(studentJson);
            }
            else {
                alert('Failed to get student registration information. Please try again.');
            }
            const electiveResponse = await fetch(`/registration/elective/available?id=14`);//${schoolYear.id}`);
            if(electiveResponse.status === 200) {
                var electiveJson = await electiveResponse.json();
                setElectiveAvailability(electiveJson);
            }
            else {
                alert('Failed to get available elective classes. Please try again.');
            }
            const gradesResponse = await fetch(`/registration/grades`);
            if(gradesResponse.status === 200) {
                var gradesJson = await gradesResponse.json();
                setGrades(gradesJson);
            }
            else {
                alert('Failed to get grades. Please try again.');
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
    },[]);

    function ageEligible(student) {
        var threshYear = schoolYear.threshYear;
        var threshMonth = 9;
        var birthYear = student.birth_year;
        var birthMonth = student.birth_month;
        if(threshYear - birthYear > 16 || threshYear - birthYear < 4)
            return false;
        else if(threshYear - birthYear === 16 || threshYear - birthYear === 4)
            return birthMonth < threshMonth;
        return true;
    }

    var eligibleStudents = studentRegistrationInfo.filter(ageEligible);
    eligibleStudents.forEach(function(student) {
        var grade = null
        if(student.prev_grade == null) {
            grade = grades.find(g => g.id === ageGradeAssignment[schoolYear.threshYear - student.birth_year]);
            if(grade) {
                student.curr_grade = grade.id;
                student.curr_grade_name = grade.chinese_name + '(' + grade.english_name + ')';
            }
        } else {
            var prev_grade = grades.find(g => g.id === student.prev_grade);
            if(prev_grade) {
                student.prev_grade_name = prev_grade.chinese_name + '(' + prev_grade.english_name + ')';
                grade = grades.find(g => g.id === prev_grade.next_grade);
                student.curr_grade = grade.id;
                student.curr_grade_name = grade.chinese_name + '(' + grade.english_name + ')';
            }
        }
    });
    
    function createSelectItems() {
        var items = [];
        var i = 0;
        items.push(<option key={i++} value={""}></option>)
        electiveAvailability.forEach(function(elective) {
            items.push(<option key={i++} value={elective.id}>{elective.chinese_name} ({elective.english_name})</option>);  
        })       
        return items;
    };

    return (
            eligibleStudents.length === 0 ? 
            <>
                <div className="registration-info" dangerouslySetInnerHTML={{__html: registrationInfo}}></div>
                <h4>No eligible students to register - please contact registration@to-cs.org for special case registration.</h4>
            </>
            :
            <>
                <div className="registration-info" dangerouslySetInnerHTML={{__html: registrationInfo}}></div>
                <h3>Select Students to Register</h3>
                <center>
                    <table id="grades">
                        <thead>
                            <tr>
                                <th></th>
                                <th></th>
                                <th>{schoolYear.prev} Grade</th>
                                <th>{schoolYear.name} Grade</th>
                                <th>Select School Class Type</th>
                                <th>Select Elective Class Type</th>
                            </tr>
                        </thead>
                        {eligibleStudents.map((entry, key) => (
                            <tbody key={key}>
                                <tr>
                                    <td><input type="checkbox" id={key} value={key}></input></td>
                                    <td>{entry.chinese_name} ({entry.english_first_name} {entry.english_last_name})</td>
                                    <td>{entry.prev_grade === null ? 'Not in Record' : entry.prev_grade_name}</td>
                                    <td>{entry.curr_grade_name}</td>
                                    <td>
                                        <select id="class-type" name="class-type" onChange={(e) => setClassType(e.target.value)}>
                                                <option key='S' value="S">S(簡)</option>
                                                <option key='T' value="T">T(繁)</option>
                                                <option key='EC' value="EC">EC</option>
                                        </select>
                                    </td>
                                    <td>
                                        <select id="elective" name="elective" onChange={(e) => setElective(e.target.value)}>
                                            {createSelectItems()}
                                        </select>
                                    </td>
                                </tr>
                            </tbody>
                        ))}
                    </table>
                </center>
                <Button type="submit">Continue</Button>
                <Button type="submit">Cancel Registration</Button>
            </>
    )
}
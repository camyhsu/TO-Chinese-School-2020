import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../libs/contextLib';
import { Button } from 'reactstrap';
import { useHistory } from 'react-router-dom';

export default function RegistrationStudentPage() {
    const { setRegisterInfo, schoolYear, status, setStatus, userData } = useAppContext();
    const history = useHistory();
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
    const [books, setBooks] = useState();
    const [discountsAvailable, setDiscountsAvailable] = useState();
    const [numStudentsRegistered, setNumStudentsRegistered] = useState();
    const studentsToRegister = [];
    const studentPreferences = [];
    const registrationStartDate = new Date(schoolYear.registration_start_date);
    const registrationEndDate = new Date(schoolYear.registration_end_date);
    const date = new Date();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const studentResponse = await fetch(`/registration/student/info?id=${userData.familyAddress.familyId}`);
                if( studentResponse.status === 200 ) {
                    var studentJson = await studentResponse.json();
                    setStudentRegistrationInfo(studentJson);
                }
                else {
                    alert('Failed to get student registration information. Please try again.');
                }
                const electiveResponse = await fetch(`/registration/elective/available?id=${schoolYear.id}`);
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
                const bookResponse = await fetch(`/registration/books?id=${schoolYear.id}`);
                if(bookResponse.status === 200) {
                    var bookJson = await bookResponse.json();
                    setBooks(bookJson);
                }
                else {
                    alert('Failed to get grades. Please try again.');
                }

                var staffResponse = null;
                if(userData.parentData.parentTwoId === null)
                    staffResponse = await fetch(`/registration/staff/status?parentOne=${userData.parentData.parentOneId}&&year=${schoolYear.id}`);
                else
                    staffResponse = await fetch(`/registration/staff/status?parentOne=${userData.parentData.parentOneId}&&parentTwo=${userData.parentData.parentTwoId}&&year=${schoolYear.id}`);
                if( staffResponse.status === 200 ) {
                    var staffJson = await staffResponse.json();
                    setDiscountsAvailable(staffJson[0]);
                }
                else {
                    alert('Failed to check staff status. Please try again');
                }
                const numStudentsRegisteredResponse = await fetch(`/registration/registered/count?user=${userData.personalData.personId}&&year=${schoolYear.id}`);
                if( numStudentsRegisteredResponse.status === 200 ) {
                    var numStudentsRegisteredJson = await numStudentsRegisteredResponse.json();
                    setNumStudentsRegistered(numStudentsRegisteredJson[0]);
                }
                else {
                    alert('Failed to get number of students registered. Please try again.');
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    // eslint-disable-next-line
    },[]);

    function cancel() {
        history.push(`/registration/home`);
    }

    function updateRegisterList(checked, key) {
        if(checked) {
            studentsToRegister.push(eligibleStudents[key]);
            studentPreferences.push(eligibleStudentPreferences[key]);
        }
        else {
            var index = studentsToRegister.indexOf(eligibleStudents[key]);
            studentsToRegister.splice(index, 1);
            studentPreferences.splice(index, 1);
        }
        console.log(studentPreferences);
    }

    function setClassType(value, key) {
        var index = studentsToRegister.indexOf(eligibleStudents[key]);
        if(index !== -1) {
            studentPreferences[index].school_class_type = value;
        }
        else {
            eligibleStudentPreferences[key].school_class_type = value;
        }
    }

    function setElective(value, key) {
        var index = studentsToRegister.indexOf(eligibleStudents[key]);
        if(index !== -1) {
            studentPreferences[index].elective_id = value ? parseInt(value, 10) : null;
        }
        else {
            eligibleStudentPreferences[key].elective_id = value ? parseInt(value, 10) : null;
        }
    }

    function ageEligible(student) {
        var threshYear = schoolYear.start_date.split('-')[0];
        var threshMonth = 9;
        var birthYear = student.birth_year;
        var birthMonth = student.birth_month;
        if(threshYear - birthYear > 16 || threshYear - birthYear < 4)
            return false;
        else if(threshYear - birthYear === 16 || threshYear - birthYear === 4)
            return birthMonth < threshMonth;
        return true;
    }

    function createSelectItems() {
        var items = [];
        var i = 0;
        items.push(<option key={i++} value={null}></option>)
        electiveAvailability.forEach(function(elective) {
            items.push(<option key={i++} value={elective.id}>{elective.chinese_name} ({elective.english_name})</option>);  
        })       
        return items;
    };

    function handleSubmit(event) {
        event.preventDefault();
        
        if(studentsToRegister.length === 0) {
            setStatus('No student selected for registration.');
        }
        else {
            setStatus('');
            setRegisterInfo(registerInfo => ({ 
                ...registerInfo,
                bookCharges: books,
                studentsToRegister: studentsToRegister,
                studentPreferences: studentPreferences,
                completedRegistration: numStudentsRegistered,
                discountsAvailable: discountsAvailable
            }));
            history.push('/registration/register/waiver');
        }
    };

    var eligibleStudentPreferences = [];
    var eligibleStudents = studentRegistrationInfo.filter(ageEligible);
    eligibleStudents.forEach(function(student) {
        var grade = null;
        if(student.prev_grade_id == null) {
            grade = grades.find(g => g.id === ageGradeAssignment[schoolYear.start_date.split('-')[0] - student.birth_year]);
            if(grade) {
                student.grade_id = grade.id;
                student.grade_name = grade.chinese_name + '(' + grade.english_name + ')';
                student.prev_grade_name = null;
            }
        } else {
            var prev_grade = grades.find(g => g.id === student.prev_grade_id);
            if(prev_grade) {
                student.prev_grade_name = prev_grade.chinese_name + '(' + prev_grade.english_name + ')';
                grade = grades.find(g => g.id === prev_grade.next_grade);
                student.grade_id = grade.id;
                student.grade_name = grade.chinese_name + '(' + grade.english_name + ')';
            }
        }

        var preferences = {};
        preferences.entered_by_id = userData.personalData.personId;
        preferences.student_id = student.id;
        preferences.school_year_id = schoolYear.id;
        preferences.prev_grade_id = student.prev_grade_id;
        preferences.grade_id = student.grade_id;
        preferences.school_class_type = 'S';
        preferences.elective_id = null;
        eligibleStudentPreferences.push(preferences);
    });

    return (
        date.getTime() < registrationStartDate || date.getTime() > registrationEndDate ?
            <>
                <h4>Registration is not open. Please check registration window here.</h4>
            </>
        :
        eligibleStudents.length === 0 ? 
        <>
            <div className="registration-info" dangerouslySetInnerHTML={{__html: registrationInfo}}></div>
            <h4>No eligible students to register - please contact registration@to-cs.org for special case registration.</h4>
        </>
        :
        <>
            <p id="status">{status}</p>
            <div className="registration-info" dangerouslySetInnerHTML={{__html: registrationInfo}}></div>
            <h3>Select Students to Register</h3>
            <form onSubmit={handleSubmit}>
                <div>
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
                                        <td><input type="checkbox" id={key} value={key} onChange={(e) => updateRegisterList(e.target.checked, key)}></input></td>
                                        <td>{entry.chinese_name} ({entry.english_first_name} {entry.english_last_name})</td>
                                        <td>{entry.prev_grade_name === null ? 'Not in Record' : entry.prev_grade_name}</td>
                                        <td>{entry.grade_name}</td>
                                        <td>
                                            <select id="class-type" name="class-type" defaultValue={"S"} onChange={(e) => setClassType(e.target.value, key)}>
                                                    <option key='S' value="S">S(簡)</option>
                                                    <option key='T' value="T">T(繁)</option>
                                                    <option key='EC' value="EC">EC</option>
                                            </select>
                                        </td>
                                        <td>
                                            <select id="elective" name="elective" onChange={(e) => setElective(e.target.value, key)}>
                                                {createSelectItems()}
                                            </select>
                                        </td>
                                    </tr>
                                </tbody>
                            ))}
                        </table>
                    </center>
                </div>
                <Button type="submit">Continue</Button>
                <Button onClick={cancel}>Cancel Registration</Button>
            </form>
        </>
    )
}
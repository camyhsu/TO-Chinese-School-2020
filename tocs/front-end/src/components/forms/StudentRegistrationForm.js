import React, { useState, useRef, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Select from 'react-validation/build/select';
import CheckButton from 'react-validation/build/button';
import { contacts, formatPersonNames, dateStarted, bilingualName } from '../../utils/utilities';
import queryString from 'query-string';
import { Card, CardBody, CardTitle } from "../Cards";
import StudentParentService from '../../services/student-parent.service';
import { ClassAssignmentsByStudents, RegistrationPreferencesByStudents } from '../student';
import { saveRegistrationPreferences } from '../../actions/student-parent.action';

const StudentRegistrationForm = ({ location } = {}) => {
    const checkBtn = useRef();
    const [successful, setSuccessful] = useState(false);
    const { message } = useSelector(state => state.message);
    const { redirect } = useSelector(state => state.user);
    const [content, setContent] = useState({
        error: null,
        isLoaded: false,
        showPreKAndK: false,
        showAp: false,
        showGradeFull: false,
        registeredStudents: []
    });
    const [formTitle, setFormTitle] = useState('');
    const [result, setResult] = useState({});
    const dispatch = useDispatch();

    const updateVariablesFromPayload = (studentId, fn) => {
        const obj = result[studentId] || {};
        fn(obj);
        setResult({ ...result, [studentId]: obj });
    };

    const { registeredStudents, showPreKAndK, showAp, showGradeFull, schoolYear, isLoaded, registrationPreferences } = content;

    const onChangeCheckbox = (e) => {
        const { name } = e.target;
        const studentId = name.replace('chk-', '');
        updateVariablesFromPayload(studentId, (obj) => { obj.checked = !obj.checked; });
    };

    const onChangeSchoolClassType = (e) => {
        const { name, value } = e.target;
        const studentId = name.replace('schoolClassType-', '');
        updateVariablesFromPayload(studentId, (obj) => { obj.schoolClassType = value; });
    };

    const onChangeElectiveSchoolClass = (e) => {
        const { name, value } = e.target;
        const studentId = name.replace('elective-class-', '');
        updateVariablesFromPayload(studentId, (obj) => { obj.electiveClassId = value; });
    };

    useEffect(() => {
        const { schoolYearId } = queryString.parse(location.search);

        if (schoolYearId) {
            StudentParentService.getStudentRegistrationDisplayOptions(schoolYearId).then(response => {
                const { person, schoolYear, registeredStudents, registrationPreferences } = response.data;
                setContent({
                    isLoaded: true,
                    showPreKAndK: true,
                    showAp: true,
                    showGradeFull: true,
                    person,
                    schoolYear,
                    registeredStudents, registrationPreferences
                });
                setFormTitle(`Registration For ${schoolYear.name} School Year`);
                setResult(registrationPreferences.reduce((r, c) => Object.assign(r, { [c.student.id]: { ...c, checked: false } }), {}));
            });
        }
    }, [dispatch, location.search]);

    const onClickContinue = (e) => {
        e.preventDefault();
        console.log('onClickContinue', result);
        const filtered = Object.values(result)
          .filter((rp) => rp.checked)
          .map((rp) => ({
            schoolYearId: rp.schoolYear.id,
            studentId: rp.student.id,
            previousGradeId: (rp.previousGrade && rp.previousGrade.id) || null,
            gradeId: rp.grade.id,
            schoolClassType: rp.schoolClassType,
            electiveClassId: rp.electiveClassId || null,
        }));
        dispatch(saveRegistrationPreferences(filtered)).then(() => {
            setSuccessful(true);
        }).catch(() => {
            setSuccessful(false);
        });
    };

    const CancelRegistration = () => (<div className="form-group col-md-4 mb-3">
        <a href="/home" className="btn btn-link btn-block">Cancel Registration</a>
    </div>);

    return (
        <>
        {successful && (<Redirect to={redirect} />)}
        <Card size="xlarge">
            <CardBody>
                <CardTitle>{formTitle}</CardTitle>

                <ul>
                    <li>
                        School Grade Placement:
                         <ol>
                            <li>
                                A new student would enroll in the age-appropriate grade.
                            </li>
                            <li>
                                A returning student is automatically assigned to one grade higher than their previous grade at Chinese School.
                            </li>
                            <li>
                                A new student must be at age 5 or beyond to be eligible for registration.
                            </li>
                        </ol>
                    </li>
                    <li>
                        School/Language class type (available types may vary by grade):
                        <ul>
                            <li><b>S</b> - Simplified Chinese (簡體中文)</li>
                            <li><b>T</b> - Traditional Chinese (繁體中文)</li>
                            <li><b>SE</b> - Simplified Chinese with English Instructions (雙語)</li>
                            <li><b>EC</b> - Everyday Chinese (<a href="https://www.to-cs.org/tocs/?p=4091" target="_blank" rel='noreferrer'>實用中文</a>)</li>
                        </ul>
                    </li>
                    <li>
                        Elective class is only available for 1st grade or above. Seats are limited. Availability for selection is on a first-come, first served basis.
                    </li>
                    <li>
                        For additional information, please read <a href="http://www.to-cs.org/tocs/" target="_blank" rel='noreferrer'>Registraion Overview and Refund Policy</a> or contact registration@to-cs.org for any questions.
                    </li>

                    {showPreKAndK && (
                        <li>
                            <span>Attention Preschool and Kindergarden new students: please bring a valid proof of birth date on the first day of school to verify age.</span>
                            <br /><span className="text-info">Please email to {contacts.REGISTRATION_CONTACT} if there are questions.</span>
                        </li>
                    )}

                    {showAp && (
                        <li>
                            <span className="font-weight-bold">Chinese AP Class Announcement: 9th and 10th grade students will be automatically enrolled in 3rd period AP class if no other 3rd period class was selected.</span>
                            <br /><span className="text-info">Please email to {contacts.REGISTRATION_CONTACT} if there are questions.</span>
                        </li>
                    )}
                </ul>

                {showGradeFull && (
                    <p className="text-danger">
                        One or more of your child has designated grade that is already full.  Unfortunately, we are not able to process
registration for full grade.  If you would like to be on the waiting list, please send an email to <span className="font-weight-bold">waiting-list@to-cs.org</span> with the name of the child,
designated grade, and contact information.  We will contact you if additional openings become available.
                    </p>
                )}

                {(isLoaded && registeredStudents && registeredStudents.length && (
                    <>
                        <h5>Students Already Registered For {schoolYear.name} School Year</h5>
                        {dateStarted(schoolYear.startDate) ? (
                            <ClassAssignmentsByStudents schoolYear={schoolYear} registeredStudents={registeredStudents} />
                        ) : (
                                <RegistrationPreferencesByStudents schoolYear={schoolYear} registeredStudents={registeredStudents} />
                            )}
                        <br />
                    </>
                )) || null}

                {(registrationPreferences && !registrationPreferences.length) ?
                    (registeredStudents.length === 0 && (
                        <p className="font-weight-bold text-danger">No eligible students to register - please contact registration@to-cs.org for special case registration</p>
                    )) : (<h5>Select Students To Register</h5>)
                }

                <Form onSubmit={e => e.preventDefault()}>
                    {registrationPreferences && registrationPreferences.map((registrationPreference, index) => (
                        <React.Fragment key={'student-' + index}>
                            <div className="row">
                                <div className="form-group col-md-2 col-2 mb-3">
                                    <Input
                                        type="checkbox"
                                        className="form-control"
                                        name={`chk-${registrationPreference.student.id}`}
                                        onChange={onChangeCheckbox}
                                    />
                                </div>
                                <div className="col-md-4 col-10 mb-3">
                                    {formatPersonNames(registrationPreference.student)}
                                </div>
                            </div>

                            <dl className="row">
                                <dt className="col-12 col-md-6 text-left text-md-right">{schoolYear.previousSchoolYear.name} Grade:</dt>
                                <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">{(registrationPreference.previousGrade && bilingualName(registrationPreference.previousGrade)) || 'Not In Record'}</dd>
                                <dt className="col-12 col-md-6 text-left text-md-right">{schoolYear.name} Grade:</dt>
                                <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">{registrationPreference.grade && bilingualName(registrationPreference.grade)}</dd>
                            </dl>

                            {result[registrationPreference.student.id] && result[registrationPreference.student.id].checked && (
                                <>
                                    <dl className="row">
                                        <dt className="col-12 col-md-6 text-left text-md-right">School Class Type:</dt>
                                        <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">
                                            {registrationPreference.gradeFull ? (
                                                <span className="font-weight-bold text-danger">{bilingualName(registrationPreference.grade)} is FULL</span>
                                            ) : (
                                                    <>
                                                        {
                                                            registrationPreference.availableSchoolClassTypes && registrationPreference.availableSchoolClassTypes.length && (
                                                                <Select
                                                                    className="form-control"
                                                                    name={`schoolClassType-${registrationPreference.student.id}`}
                                                                    value={result[registrationPreference.student.id].schoolClassType}
                                                                    onChange={onChangeSchoolClassType}>
                                                                    {registrationPreference.availableSchoolClassTypes.map(ct => (<option key={`ct-${ct.schoolClassType}`} value={ct.schoolClassType}>{ct.text}</option>))}
                                                                </Select>
                                                            )
                                                        }
                                                        {
                                                            (registrationPreference.fullSchoolClassTypes && registrationPreference.fullSchoolClassTypes.length
                                                                && registrationPreference.fullSchoolClassTypes.map(ct => (<div>FULL - {ct.text}</div>))) || null
                                                        }
                                                    </>
                                                )
                                            }
                                        </dd>
                                    </dl>
                                    <dl className="row">
                                        <dt className="col-12 col-md-6 text-left text-md-right">Elective Class:</dt>
                                        <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">
                                            {registrationPreference.availableElectiveSchoolClasses && registrationPreference.availableElectiveSchoolClasses.length && (
                                                <Select
                                                    className="form-control"
                                                    name={`elective-class-${registrationPreference.student.id}`}
                                                    value={result[registrationPreference.student.id].electiveSchoolClass}
                                                    onChange={onChangeElectiveSchoolClass}>
                                                    {[
                                                        (<option key="" value=""></option>)
                                                    ].concat(registrationPreference.availableElectiveSchoolClasses.map(ct => (<option key={`ct-${ct.id}`} value={ct.id}>{ct.text}</option>)))}
                                                </Select>
                                            )
                                            }
                                        </dd>
                                    </dl>
                                </>
                            )}
                            <hr />
                        </React.Fragment>
                    ))}
                    {message && !successful && (
                        <div className="form-group">
                            <div className={successful ? "alert alert-success" : "alert alert-danger"} role="alert">
                                {message}
                            </div>
                        </div>
                    )}
                    <CheckButton style={{ display: "none" }} ref={checkBtn} />
                </Form>

                <div className="row">
                    <div className="form-group col-md-8 mb-3 order-md-last">
                        {result && Object.values(result).reduce((r, c) => r || c.checked, false) && (
                            <button className="btn btn-primary btn-block" onClick={onClickContinue}>Continue</button>
                        )}
                    </div>
                    <CancelRegistration />
                </div>
            </CardBody >
        </Card >
        </>
    );
};

export default StudentRegistrationForm;
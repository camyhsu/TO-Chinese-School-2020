import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AppContext } from './libs/contextLib';
import './App.css';
import RegistrationNavBar from './components/RegistrationNavBar';
import RegistrationSideBar from './components/RegistrationSideBar';
import RedirectPage from './pages/RedirectPage';
import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage';
import PeopleDirectoryPage from './pages/directories/PeopleDirectoryPage';
import GradesDirectoryPage from './pages/directories/GradesDirectoryPage';
import EditPersonalDetailsPage from './pages/user/EditPersonalDetailsPage';
import EditPersonalAddressPage from './pages/user/EditPersonalAddressPage';
import EditFamilyAddressPage from './pages/user/EditFamilyAddressPage';
import EditStudentDetailsPage from './pages/user/EditStudentDetailsPage';
import AddChildPage from './pages/user/AddChildPage';
import ChangePasswordPage from './pages/user/ChangePasswordPage';
import NotFoundPage from './pages/NotFoundPage';
import StudentCountByGradePage from './pages/directories/StudentCountByGradePage';
import StudentCountByClassPage from './pages/directories/StudentCountByClassPage';
import StudentCountByElectivePage from './pages/directories/StudentCountByElectivePage';
import ActiveClassPage from './pages/directories/ActiveClassPage';
import AllSchoolClassesPage from './pages/directories/AllSchoolClassesPage';
import StudentListForClassPage from './pages/directories/StudentListForClassPage';
import PeopleProfilePage from './pages/directories/PeopleProfilePage';
import CreatePersonalAddressPage from './pages/user/CreatePersonalAddressPage';
import ActiveStudentsPage from './pages/directories/ActiveStudentsPage';
import RegistrationStudentPage from './pages/registration/RegistrationStudentPage';
import RegistrationWaiverPage from './pages/registration/RegistrationWaiverPage';
import RegistrationPaymentPage from './pages/registration/RegistrationPaymentPage';

export default function App() {
    const [schoolYear] = useState({'id': 14, 'name': '2020-2021', 'threshYear': 2020, 'prev' : '2019-2020'})
    const [isAuthenticated, userHasAuthenticated] = useState(false);
    const [userData, setUserData] = useState({
        person: {
            'username': '',
            'personId': '',
            'addressId': '',
            'chineseName': '',
            'englishFirstName': '',
            'englishLastName': '',
            'gender': '',
            'birthMonth': '',
            'birthYear': '',
            'nativeLanguage': '',
            'street': '',
            'city': '',
            'state': '',
            'zipcode': '',
            'homePhone': '',
            'cellPhone': '',
            'email': ''
        },
        parents: {
            'parentOneId': '',
            'parentOneEnglishName': '',
            'parentOneChineseName': '',
            'parentOneUsername': '',
            'parentTwoId':'',
            'parentTwoEnglishName': '',
            'parentTwoChineseName': '',
            'parentTwoUsername': '',
        },
        family: {
            'familyId': '',
            'addressId': '',
            'children': [],
            'street': '',
            'city': '',
            'state': '',
            'zipcode': '',
            'homePhone': '',
            'cellPhone': '',
            'email': ''
        },
        students: [],
    });
    const [status, setStatus] = useState('');
    const [registerList, setRegisterList] = useState([]);

    return(
        <AppContext.Provider value={{ registerList, setRegisterList, schoolYear, status, setStatus, userData, setUserData, isAuthenticated, userHasAuthenticated}}>
            <Router>
                <div className="App">
                    { // only show Registration NavBar and SideBar if user is authenticated
                        isAuthenticated ?
                        <>
                            <RegistrationNavBar />
                            <RegistrationSideBar />
                        </> :
                        null
                    }
                    <div id="page-body">
                        <Switch>
                            <Route path='/' component={RedirectPage} exact />
                            <Route path='/registration/home' component={HomePage} exact />
                            <Route path='/registration/signin' component={SignInPage} exact />
                            <Route path='/registration/register/select' component={RegistrationStudentPage} exact />
                            <Route path='/registration/register/waiver' component={RegistrationWaiverPage} exact />
                            <Route path='/registration/register/payment' component={RegistrationPaymentPage} exact />
                            <Route path='/registration/list/people' component={PeopleDirectoryPage} exact/>
                            <Route path='/registration/list/grades' component={GradesDirectoryPage} exact/>
                            <Route path='/registration/list/classes' component={AllSchoolClassesPage} exact/>
                            <Route path='/registration/list/studentcount/grade' component={StudentCountByGradePage} exact/>
                            <Route path='/registration/list/studentcount/class' component={StudentCountByClassPage} exact/>
                            <Route path='/registration/list/studentcount/elective' component={StudentCountByElectivePage} exact/>
                            <Route path='/registration/list/studentlist/class' component={StudentListForClassPage} />
                            <Route path='/registration/list/classes/active' component={ActiveClassPage} exact/>
                            <Route path='/registration/list/students/active' component={ActiveStudentsPage} exact/>
                            <Route path='/registration/people/profile' component={PeopleProfilePage} />
                            <Route path='/registration/user/edit' component={EditPersonalDetailsPage} />
                            <Route path='/registration/user/password/edit' component={ChangePasswordPage} exact/>
                            <Route path='/registration/user/address/edit' component={EditPersonalAddressPage} />
                            <Route path='/registration/family/address/edit' component={EditFamilyAddressPage} />
                            <Route path='/registration/family/child/add' component={AddChildPage} />
                            <Route path='/registration/student/edit' component={EditStudentDetailsPage} />
                            <Route path='/registration/user/address/create' component={CreatePersonalAddressPage} />
                            <Route component={NotFoundPage} />
                        </Switch>
                    </div>
                </div>
            </Router>
        </AppContext.Provider>
    );
}
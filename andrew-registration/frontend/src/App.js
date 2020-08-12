import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AppContext } from './libs/contextLib';
import './App.css';
import RegistrationNavBar from './components/RegistrationNavBar';
import RegistrationSideBar from './components/RegistrationSideBar';
import HomePage from './pages/HomePage';
import RegistrationHomePage from './pages/RegistrationHomePage';
import RegistrationSignInPage from './pages/RegistrationSignInPage';
import PeopleDirectoryPage from './pages/PeopleDirectoryPage';
import GradesDirectoryPage from './pages/GradesDirectoryPage';
import EditPersonalDetailsPage from './pages/EditPersonalDetailsPage';
import EditPersonalAddressPage from './pages/EditPersonalAddressPage';
import EditFamilyAddressPage from './pages/EditFamilyAddressPage';
import EditStudentDetailsPage from './pages/EditStudentDetailsPage';
import AddChildPage from './pages/AddChildPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import NotFoundPage from './pages/NotFoundPage';
import StudentCountByGradePage from './pages/StudentCountByGradePage';
import StudentCountByClassPage from './pages/StudentCountByClassPage';
import StudentCountByElectivePage from './pages/StudentCountByElectivePage';
import ActiveClassPage from './pages/ActiveClassPage';

export default function App() {
    const [isAuthenticated, userHasAuthenticated] = useState(false);
    const [userData, setUserData] = useState({
        person: {
            'username': '',
            'person_id': '',
            'address_id': '',
            'chineseName': '',
            'englishFirstName': '',
            'englishLastName': '',
            'gender': '',
            'birthMonthYear': '',
            'nativeLanguage': '',
            'street': '',
            'city': '',
            'state': '',
            'zipcode': '',
            'homePhone': '',
            'cellPhone': '',
            'email': ''
        },
        family: {
            'family_id': '',
            'address_id': '',
            'parentTwoEnglishName': '',
            'parentTwoChineseName': '',
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

    return(
        <AppContext.Provider value={{ status, setStatus, userData, setUserData, isAuthenticated, userHasAuthenticated}}>
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
                            <Route path='/' component={HomePage} exact />
                            <Route path='/registration' component={RegistrationHomePage} exact />
                            <Route path='/registration/signin' component={RegistrationSignInPage} exact />
                            <Route path='/registration/list/people' component={PeopleDirectoryPage} exact/>
                            <Route path='/registration/list/grades' component={GradesDirectoryPage} exact/>
                            <Route path='/registration/list/studentcount/grades' component={StudentCountByGradePage} exact/>
                            <Route path='/registration/list/studentcount/class' component={StudentCountByClassPage} exact/>
                            <Route path='/registration/list/studentcount/elective' component={StudentCountByElectivePage} exact/>
                            <Route path='/registration/list/classes/active' component={ActiveClassPage} exact/>
                            <Route path='/registration/user/edit' component={EditPersonalDetailsPage} exact />
                            <Route path='/registration/user/password/edit' component={ChangePasswordPage} exact/>
                            <Route path='/registration/user/address/edit' component={EditPersonalAddressPage} exact />
                            <Route path='/registration/family/address/edit' component={EditFamilyAddressPage} exact/>
                            <Route path='/registration/family/addchild' component={AddChildPage} exact/>
                            <Route path='/registration/student/edit' component={EditStudentDetailsPage} />
                            <Route component={NotFoundPage} />
                        </Switch>
                    </div>
                </div>
            </Router>
        </AppContext.Provider>
    );
}
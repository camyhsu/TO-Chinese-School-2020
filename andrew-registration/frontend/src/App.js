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
import EditPersonalDetailsPage from './pages/EditPersonalDetailsPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
    const [isAuthenticated, userHasAuthenticated] = useState(false);
    const [userData, setUserData] = useState({
        person: {
            'id': '',
            'chineseName': '',
            'englishFirstName': '',
            'englishLastName': '',
            'gender': '',
            'birthMonthYear': '',
            'nativeLanguage': '',
            'address': '',
            'homePhone': '',
            'cellPhone': '',
            'email': ''
        },
        family: {
            'parentTwoEnglishName': '',
            'parentTwoChineseName': '',
            'children': [],
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
                            <Route path="/" component={HomePage} exact />
                            <Route path="/registration" component={RegistrationHomePage} exact />
                            <Route path="/registration/signin" component={RegistrationSignInPage} exact />
                            <Route path="/registration/people" component={PeopleDirectoryPage} exact/>
                            <Route path='/registration/people/edit' component={EditPersonalDetailsPage} exact />
                            <Route component={NotFoundPage} />
                        </Switch>
                    </div>
                </div>
            </Router>
        </AppContext.Provider>
    );
}
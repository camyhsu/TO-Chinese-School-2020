import dataService from './data.service';

const getActiveSchoolClasses = () => dataService.get('instruction/active_school_classes/index');

const obj = {
    getActiveSchoolClasses
};

export default obj;
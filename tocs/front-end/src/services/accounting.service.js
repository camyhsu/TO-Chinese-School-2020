import dataService from './data.service';

const getInstructorDiscounts = () => dataService.get('accounting/instructors/discount');

const obj = {
    getInstructorDiscounts
};

export default obj;
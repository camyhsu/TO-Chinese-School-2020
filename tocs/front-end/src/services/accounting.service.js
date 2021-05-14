import dataService from './data.service';

const getInstructorDiscounts = () => dataService.get('accounting/instructors/discount');

const getChargesCollected = (schoolYearId) => dataService.get(`accounting/registration_report/charges_collected_report/${schoolYearId}`);

const obj = {
    getInstructorDiscounts, getChargesCollected
};

export default obj;
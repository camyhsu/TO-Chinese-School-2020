import dataService from './data.service';

const getInstructorDiscounts = () => dataService.get('accounting/instructors/discount');

const getChargesCollected = (schoolYearId) => dataService.get(`accounting/registration_report/charges_collected_report/${schoolYearId}`);

const initializeManualTransaction = (personId) => dataService.get(`accounting/manual_transactions/new?personId=${personId}`);

const addManualTransaction = (obj) => dataService.post('accounting/manual_transactions/new', obj);

const obj = {
    getInstructorDiscounts, getChargesCollected, initializeManualTransaction, addManualTransaction
};

export default obj;
// import axios from "axios";
// import authHeader from "./auth-header";

// const API_URL = "http://localhost:3001/api/test/";


const getAdminBoard = () => {
  return Promise.resolve('Admin'); // axios.get(API_URL + "admin", { headers: authHeader() });
};

const mock = {
  person: {
      personId: 1,
      chineseName: 'p1-cn',
      firstName: 'p1-fn',
      lastName: 'p1-ln',
      gender: 'M',
      birthMonth: '8',
      birthYear: '1999',
      nativeLanguage: 'Cantonese'
  },
  address: {
      address: '6 Park Lane Coram, NY 11727',
      homePhone: '(865) 272-4935',
      cellPhone: '(832) 721-1603',
      email: 'cgcra@yahoo.com'
  },
  families: [
      {
          familyId: 101,
          name: 'family 1',
          parentOne: 'f1-p1',
          parentTwo: 'f1-p2',
          address: {
              address: '709 Jones Rd. Bradenton, FL 34203',
              homePhone: '(815) 592-0564',
              cellPhone: '(713) 872-3737',
              email: 'cgcra@yahoo.com'
          },
          students: [
              {
                personId: 10,
                chineseName: 'c1-cn',
                firstName: 'c1-fn',
                lastName: 'c1-ln',
                gender: 'F',
                birthMonth: '3',
                birthYear: '2000',
                nativeLanguage: 'Mandarin'
              }, {
                personId: 11,
                chineseName: 'c2-cn',
                firstName: 'c2-fn',
                lastName: 'c2-ln',
                gender: 'M',
                birthMonth: '12',
                birthYear: '2010',
                nativeLanguage: 'Mandarin'
              }
          ]
      },
      {
          familyId: 102,
          name: 'family 2',
          parentOne: 'f2-p1',
          parentTwo: null,
          address: {
              address: '8114 Somerset Road Vineland, NJ 08360',
              homePhone: '(985) 222-4323',
              cellPhone: '(304) 268-2554',
              email: 'intlprog@mac.com'
          },
          students: [
            {
                personId: 12,
                chineseName: 'c3-cn',
                firstName: 'c3-fn',
                lastName: 'c3-ln',
                gender: 'F',
                birthMonth: '2',
                birthYear: '2011',
                nativeLanguage: 'Mandarin'
              }, {
                personId: 13,
                chineseName: 'c4-cn',
                firstName: 'c4-fn',
                lastName: 'c4-ln',
                gender: 'M',
                birthMonth: '10',
                birthYear: '2002',
                nativeLanguage: 'English'
              }
          ]
      }
  ]
};

const getStudentParentBoard = () => {
  return Promise.resolve({ data: mock });
};

const savePerson = (personId, obj) => {
    console.log('saving person...', personId, obj);
    const persons = {
        [mock.person.personId]: mock.person,
    };
    mock.families.forEach(family => family.students.forEach(student => Object.assign(persons, { [student.personId]: student })));

    Object.assign(persons[personId], obj);
    return Promise.resolve({ data: { ...obj, message: 'OK' }});
};

const addParent = (familyId, obj) => {
    console.log('add parent to family...', familyId, obj);
    Object.assign(mock.person, obj);
    return Promise.resolve({ data: { ...obj, message: 'OK' }});
};

const addChild = (familyId, obj) => {
    console.log('add child to family...', familyId, obj);
    mock.families.forEach(family => family.students.push(Object.assign(obj, { personId: family.students.length + 1001 })));
    return Promise.resolve({ data: { ...obj, message: 'OK' }});
};

const obj = {
  getAdminBoard, getStudentParentBoard, savePerson, addParent, addChild
};

export default obj;

import { handler } from '../lambda/http/getGradebookItems';
import * as eventGenerator from '../__test__utils/eventGenerator.js';
const utils = require('../lambda/utils');
const gradebook = require('../businessLogic/gradebook');

const event = eventGenerator({
    body: {}
});

describe('GetAllGradebookItems test happy path', () => {
    test('should return all the items and 200 status', async () => {
        const goodReturn = {
            items: [
                {
                    finalGrade: 'D',
                    instructorId: '949498',
                    studentId: '1',
                    firstName: 'Tess',
                    lastName: 'Ter',
                    dateOfBirth: '01-01-2001',
                    photoUrl: 'https://i.picsum.photos/id/1027/200/300.jpg?hmac=WCxdERZ7sgk4jhwpfIZT0M48pctaaDcidOi3dKSHJYY'
                },
                {
                    finalGrade: 'B',
                    instructorId: '949498',
                    studentId: '2',
                    firstName: 'Kathy',
                    lastName: 'Chase',
                    dateOfBirth: '02-02-2002',
                    photoUrl: 'https://i.picsum.photos/id/1027/200/300.jpg?hmac=WCxdERZ7sgk4jhwpfIZT0M48pctaaDcidOi3dKSHJYY'
                }
            ]
        };
    
        const retrieveInstructorIdMock = jest.spyOn(utils, 'retrieveInstructorId');
        retrieveInstructorIdMock.mockImplementation(() => '949498');

        const getAllGradeItemsMock = jest.spyOn(gradebook, 'getAllGradebookItems');
        getAllGradeItemsMock.mockImplementation(() => Promise.resolve(goodReturn));

        const body = JSON.stringify({ items: goodReturn.items });
        const expectedReturn = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Methods': 'OPTIONS,POST,DELETE,GET,PATCH'
            },
            body
        };

        const response = await handler(event, null, null);

        expect(retrieveInstructorIdMock).toHaveBeenCalledTimes(1);
        expect(getAllGradeItemsMock).toHaveBeenCalledTimes(1);
        expect(response).toMatchObject(expectedReturn);
    });
});

test('should return an error message and 404 status', async () => {
    const retrieveInstructorIdMock = jest.spyOn(utils, 'retrieveInstructorId');
    retrieveInstructorIdMock.mockImplementation(() => '949498');

    const getAllGradeItemsMock = jest.spyOn(gradebook, 'getAllGradebookItems');
    getAllGradeItemsMock.mockImplementation(() => Promise.reject('some error'));

    const body = JSON.stringify({
        msg: 'An error has occurred.',
        error: 'some error'
    });

    const returnObj = {
        statusCode: 404,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body
    };
    const response = await handler(event, null, null);

    expect(response).toMatchObject(returnObj);
});
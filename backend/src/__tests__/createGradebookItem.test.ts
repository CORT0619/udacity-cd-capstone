import { handler } from '../lambda/http/createGradebookItem';
import * as eventGenerator from '../__test__utils/eventGenerator.js';
const gradebook = require('../businessLogic/gradebook');
const utils = require('../lambda/utils');

const mock = {
    studentId: '958948934438439-494585',
    instructorId: '949498',
    firstName: 'Taylor',
    lastName: 'Haley',
    dateOfBirth: '11-24-1980',
    finalGrade: 'A'
};

const event = eventGenerator({
    body: mock
});

describe('CreateGradebookItems', () => {
    test('should return a successful message', async () => {
        const body = JSON.stringify({
            item: mock,
            message: 'student created successfully!'
        });
        const returnedResponse = {
            statusCode: 201,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body
        };
        
        const retrieveInstructorIdMock = jest.spyOn(utils, 'retrieveInstructorId');
        retrieveInstructorIdMock.mockImplementation(() => '949498');

        const createGradebookItemMock = jest.spyOn(gradebook, 'createGradebookItem');
        createGradebookItemMock.mockImplementation(() => Promise.resolve({
            gradebookItem: mock
        }));

        const response = await handler(event, null, null);
        expect(response).toMatchObject(returnedResponse);
    });

    test ('should return error message and 401', async () => {
        const err = 'error creating gradebook item';

        const retrieveInstructorIdMock = jest.spyOn(utils, 'retrieveInstructorId');
        retrieveInstructorIdMock.mockImplementation(() => '949498');

        const createGradebookItemMock = jest.spyOn(gradebook, 'createGradebookItem');
        createGradebookItemMock.mockImplementation(() => Promise.reject(err));

        const body = JSON.stringify({ error: `An error occurred while adding the student to the gradebook: ${err}` });

        const badResponse = {
            statusCode: 401,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
              },
              body
        };

        const response = await handler(event, null, null);
        expect(response).toMatchObject(badResponse);
    });
});
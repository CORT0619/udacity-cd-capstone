import { handler } from '../lambda/http/updateGradebookItem';
import { jest, describe, test, expect } from '@jest/globals';
const eventGenerator = require('../__test__utils/eventGenerator.js');
const gradebook = require('../businessLogic/gradebook');
const utils = require('../lambda/utils');

const studentId = '494j45k453-856u565i66';
const updateItem = {
    firstName: 'Cortney',
    lastName: 'Gordon',
    finalGrade: 'B'
};

const event = eventGenerator({
    body: updateItem,
    pathParametersObject: {
        studentId
    }
})

describe('UpdateGradebookItem', () => {
    test('should return a successful message', async () => {
        const body = JSON.stringify({ updatedItem: updateItem });
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

        const deleteGradebookItemMock = jest.spyOn(gradebook, 'updateGradebookItem');
        deleteGradebookItemMock.mockImplementation(() => Promise.resolve({
            gradebookItem: updateItem
        }));        

        const response = await handler(event, null, null);
        expect(response).toMatchObject(returnedResponse);
    });

    test('should return an error message and 500 status code', async () => {
        const err = 'an error occurred updating the gradebook item';

        const retrieveInstructorIdMock = jest.spyOn(utils, 'retrieveInstructorId');
        retrieveInstructorIdMock.mockImplementation(() => '949498');

        const createGradebookItemMock = jest.spyOn(gradebook, 'updateGradebookItem');
        createGradebookItemMock.mockImplementation(() => Promise.reject(err));

        const body = JSON.stringify({ 
            error: err
         });

        const badResponse = {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
              },
              body
        };

        const response = await handler(event, null, null);
        expect(response).toMatchObject(badResponse);
    });
})
import { handler } from '../lambda/http/deleteGradebookItem';
const eventGenerator = require('../__test__utils/eventGenerator.js');
const gradebook = require('../businessLogic/gradebook');
const utils = require('../lambda/utils');

const event = eventGenerator({
    body: {},
    pathParametersObject: {
        studentId: '445u35h309wwh-2jk32y4u'
    }
})

describe('DeleteGradebookItem', () => {
    test('should return a successful message', async () => {
        const body = JSON.stringify({ message:`GradebookItem 494j45k453-856u565i66 deleted successfully!` });
        const returnedResponse = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body            
        };

        const retrieveInstructorIdMock = jest.spyOn(utils, 'retrieveInstructorId');
        retrieveInstructorIdMock.mockImplementation(() => '949498');

        const deleteGradebookItemMock = jest.spyOn(gradebook, 'deleteGradebookItem');
        deleteGradebookItemMock.mockImplementation(() => Promise.resolve({
            result: {}
        }));        

        const response = await handler(event, null, null);
        expect(response).toMatchObject(returnedResponse);
    });

    test('should return an error message and 404 status code', async () => {
        const err = 'an error occurred deleting the gradebook item';

        const retrieveInstructorIdMock = jest.spyOn(utils, 'retrieveInstructorId');
        retrieveInstructorIdMock.mockImplementation(() => '949498');

        const deleteGradebookItemMock = jest.spyOn(gradebook, 'deleteGradebookItem');
        deleteGradebookItemMock.mockImplementation(() => Promise.reject(err));

        const body = JSON.stringify({ 
            message: 'An error has occurred. GradebookItem deletion unsuccessful.',
            error: err
         });

        const badResponse = {
            statusCode: 404,
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
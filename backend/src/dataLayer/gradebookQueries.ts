import * as AWS from 'aws-sdk';
const AWSXRay = require('aws-xray-sdk');
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
// import { GradebookItem } from '../models/GradebookItem';
import { GradebookItemRequest } from '../models/GradebookItemRequest';
import { UpdateRequest } from '../models/ModifyGradebookItem';

const XAWS = AWSXRay.captureAWS(AWS);

export class GradebookQueries {
    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly gradesTable = process.env.GRADES_TABLE,
        private readonly studentIndex = process.env.STUDENT_ID_INDEX
    ) {}

    async createGradebookItem(gradebookItem: GradebookItemRequest) {
        console.log('gradebookItem ', gradebookItem);

        await this.docClient.put({
            TableName: this.gradesTable,
            Item: gradebookItem
        }).promise();

        return {
            gradebookItem
        };
    }

    async deleteGradebookItem(studentId, instructorId) {
        const deleteResult = await this.docClient.delete({ TableName: this.gradesTable, Key: { studentId, instructorId } }).promise();
        console.log('deleteResult ', deleteResult);

        return {
            result: deleteResult
        };
    }

    async updateGradebookItem(studentId, instructorId, gradebookItem: UpdateRequest) {
        const request = {
            TableName: this.gradesTable,
            Key: {
                studentId,
                instructorId
            },
            // ProjectionExpression: '', // don't think this is needed - no reserved words
            // ExpressionAttributeNames: { '': '' }, // don't think this is needed - no reserved words
            UpdateExpression: 'set firstName=:f, lastName=:l, finalGrade=:g, photoUrl=:p',
            ExpressionAttributeValues: {
                ":f": gradebookItem.firstName,
                ":l": gradebookItem.lastName,
                ":g": gradebookItem.finalGrade,
                ":p": gradebookItem.photoUrl 
            },
            ReturnValues: 'UPDATED_NEW'
        };

        const updateResult = await this.docClient.update(request).promise();
        console.log('updateResult ', updateResult);

        return {
            gradebookItem
        };
    }

    async getGradebookItems(instructorId) {
        console.log('instructorId ', instructorId);
        const itemsResult = await this.docClient.query({
            TableName: this.gradesTable,
            IndexName: this.studentIndex,
            KeyConditionExpression: 'instructorId = :instructorId',
            ExpressionAttributeValues: {
                ':instructorId': instructorId
            }
        }).promise();

        console.log('itemsResult ', itemsResult);

        return {
            items: itemsResult.Items
        };
    }

    async updatePhotoUrl(studentId, instructorId, photoUrl: string) {
        const request = {
            TableName: this.gradesTable,
            Key: {
                instructorId,
                studentId
            },
            UpdateExpression: 'set photoUrl=:p',
            ExpressionAttributeValues: {
                ':p': photoUrl
            },
            ReturnValues: 'UPDATED_NEW'
        };

        const photoUpdateResult = await this.docClient.update(request).promise();
        console.log('photoUpdateResult ', photoUpdateResult);
        return photoUpdateResult;
    }
}

function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
        console.log('Creating a local DynamoDB instance');
        return new XAWS.DynamoDB.DocumentClient({
          region: 'localhost',
          endpoint: 'http://localhost:8000'
        });
    }

    return new XAWS.DynamoDB.DocumentClient();
}  
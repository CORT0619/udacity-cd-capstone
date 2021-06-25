import * as AWS from 'aws-sdk';
const AWSXRay = require('aws-xray-sdk');
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { GradebookItemRequest } from '../models/GradebookItemRequest';
// import { UpdateRequest } from '../models/ModifyGradebookItem';
import { InitialUpdateRequest } from '../models/ModifyGradebookItem';


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

    async updateGradebookItem(studentId, instructorId, gradebookItem: InitialUpdateRequest) {
        const request = {
            TableName: this.gradesTable,
            Key: {
                studentId,
                instructorId
            },
            UpdateExpression: 'set firstName=:f, lastName=:l',
            ExpressionAttributeValues: {
                ":f": gradebookItem.firstName,
                ":l": gradebookItem.lastName
            },
            ReturnValues: 'UPDATED_NEW'
        };

        if (gradebookItem.finalGrade) {
            request.UpdateExpression = request.UpdateExpression + ', finalGrade=:g';
            request.ExpressionAttributeValues[":g"] = gradebookItem.finalGrade;
        }

        if (gradebookItem.photoUrl) {
            request.UpdateExpression = request.UpdateExpression + ', photoUrl=:p';
            request.ExpressionAttributeValues[":p"] = gradebookItem.photoUrl;
        }
        const updateResult = await this.docClient.update(request).promise();
        console.log('updateResult ', updateResult);

        return {
            gradebookItem
        };
    }

    async getGradebookItems(instructorId) {
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
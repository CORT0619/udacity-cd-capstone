import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { createLogger } from '../../utils/logger';
import { retrieveInstructorId } from '../utils';
import { InitialUpdateRequest } from '../../models/ModifyGradebookItem';
import { updateGradebookItem } from '../../businessLogic/gradebook';

const logger = createLogger('http');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { studentId } = event.pathParameters;
  const instructorId = retrieveInstructorId(event);
  const updatedItem: InitialUpdateRequest = JSON.parse(event.body);
  

  try {
    const result = await updateGradebookItem(studentId, instructorId, updatedItem);
    console.log('result ', result);

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        updatedItem
      })
    }
  } catch (e) {
    logger.error('An error occurred updating the gradebook item', { error: e });

    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        error: e
      })
    }
  }
}

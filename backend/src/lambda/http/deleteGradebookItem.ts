import 'source-map-support/register';

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import { createLogger } from '../../utils/logger';
import { retrieveInstructorId } from '../utils';
import { deleteGradebookItem } from '../../businessLogic/gradebook';

const logger = createLogger('http');
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('event ', event);
  const studentId = event.pathParameters.studentId;
  const instructorId = retrieveInstructorId(event);

  try {
    await deleteGradebookItem(studentId, instructorId);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        message: `GradebookItem ${studentId} deleted successfully!`
      })
    }

  } catch (err) {
    console.log('err ', err);
    logger.error('An error has occurred deleting the gradebookItem ', { error: err});

    return {
      statusCode: 404,
      body: JSON.stringify({
        message: 'An error has occurred. GradebookItem deletion unsuccessful.',
        error: err
      })
    }
  }
}

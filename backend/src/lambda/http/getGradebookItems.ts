import 'source-map-support/register';

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import { createLogger } from '../../utils/logger';
import { retrieveInstructorId } from '../utils';
import { getAllGradebookItems } from '../../businessLogic/gradebook';

const logger = createLogger('http');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const instructorId = retrieveInstructorId(event);
  console.log('instructorId ', instructorId);

  try {
    const result = await getAllGradebookItems(instructorId);
    console.log('all gradebook items ', result);
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ items: result })
    }
  } catch (err) {
    logger.error('an error occurred retrieving todos ', { error: err });

    return {
      statusCode: 404,
      body: JSON.stringify({
        msg: 'An error has occurred.',
        error: err
      })
    }
  }
}

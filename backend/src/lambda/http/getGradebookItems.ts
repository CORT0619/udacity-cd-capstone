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
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Methods': 'OPTIONS,POST,DELETE,GET,PATCH'
      },
      body: JSON.stringify({ items: result.items })
    }
  } catch (err) {
    logger.error('an error occurred retrieving todos ', { error: err });

    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        msg: 'An error has occurred.',
        error: err
      })
    }
  }
}

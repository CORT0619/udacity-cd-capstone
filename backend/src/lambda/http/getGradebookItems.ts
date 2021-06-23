import 'source-map-support/register';

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import { createLogger } from '../../utils/logger';
import { retrieveInstructorId } from '../utils';
import { getAllGradebookItems } from '../../businessLogic/gradebook';

const logger = createLogger('http');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // console.log('event ', event);
  const id = retrieveInstructorId(event);

  try {
    const result = await getAllGradebookItems(id);

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
    logger.error('an error occurred retrieving grades ', { error: err });

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

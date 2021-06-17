import 'source-map-support/register';
import { createLogger } from '../../utils/logger';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { GradebookItem } from '../../models/GradebookItem';
import { retrieveInstructorId } from '../utils';
import { createGradebookItem } from '../../businessLogic/gradebook';

const logger = createLogger('http');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const instructorId = retrieveInstructorId(event);

  try {
    let item: GradebookItem;
    item = JSON.parse(event.body);
    item.instructorId = instructorId;
    console.log('item ', item);

    const createResponse = await createGradebookItem(item);

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        gradebookItem: createResponse,
        message: 'student created successfully!'
      })
    }
  } catch (error) {
    console.log('error creating student: ', error);
    logger.error('Error creating student: ', { error });

    return {
      statusCode: 401,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ error: `An error occurred while adding the student to the gradebook: ${error}` })
    };
  }
}

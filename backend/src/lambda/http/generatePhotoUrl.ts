import 'source-map-support/register';
import * as AWS from 'aws-sdk';
import * as uuid from 'uuid';

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { retrieveInstructorId } from '../utils';
import { createLogger } from '../../utils/logger';
import { updatePhotoUrl } from '../../businessLogic/gradebook';

const logger = createLogger('http');

const s3 = new AWS.S3({
  signatureVersion: 'v4'
});

const bucketName = process.env.PICTURE_S3_BUCKET;
const urlExpiration = process.env.SIGNED_URL_EXPIRATION;

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { studentId } = event.pathParameters;

  const instructorId = retrieveInstructorId(event);
  const photoId = uuid.v4();
  const url = getUploadUrl(photoId);
  const attachmentUrl = `https://${process.env.PICTURE_S3_BUCKET}.s3.amazonaws.com/${photoId}`

  try {
    const result = await updatePhotoUrl(studentId, instructorId, attachmentUrl);
    console.log('update attachments url result ', result);

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        photoUrl: url
      })
    }
  } catch (e) {
    logger.error('An error occurred updating an attachmentUrl', { error: e });
  }
}

function getUploadUrl(id: string) {
  logger.info('generating signed url...');
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: id,
    Expires: urlExpiration
  });
}

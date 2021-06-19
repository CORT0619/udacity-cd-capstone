import { CustomAuthorizerResult, APIGatewayTokenAuthorizerEvent } from 'aws-lambda'
import 'source-map-support/register'
import { verify, decode } from 'jsonwebtoken';
import { createLogger } from '../../utils/logger';
import Axios from 'axios';
import { Jwt } from '../../auth/Jwt';
import { JwtPayload } from '../../auth/JwtPayload';
const logger = createLogger('auth')

// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
const jwksUrl = 'https://dev-e87hv0tz.us.auth0.com/.well-known/jwks.json';
let response;

export const handler = async (
  event: APIGatewayTokenAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken);
    console.log('jwtToken ', jwtToken);
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader); // token passed in
  console.log('token ', token);

  const jwt: Jwt = decode(token, { complete: true }) as Jwt
  const { header } = jwt;

  // get keyset
  response = await Axios.get(jwksUrl, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const signingKey = response.data.keys.find(key => key.kid === header.kid);
  console.log('signingKey ', signingKey);

  let certificate = signingKey.x5c[0];
  certificate = certificate.match(/.{1,64}/g).join('\n');
  const certificateKey = `-----BEGIN CERTIFICATE-----\n${ certificate }\n-----END CERTIFICATE-----\n`;

  const JwtPayload:JwtPayload = verify(token, certificateKey, { algorithms: ['RS256'] }) as JwtPayload;
  return JwtPayload;
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ');
  const token = split[1];

  return token;
}
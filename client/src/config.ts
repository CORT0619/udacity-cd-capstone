// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = ''; // change once endpoints deployed
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-e87hv0tz.us.auth0.com',            // Auth0 domain
  clientId: 'uakkEz40V4hv4ojJ9Ms4K7E60J3evdze',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}

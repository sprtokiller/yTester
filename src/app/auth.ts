import { OAuth2Client } from 'google-auth-library'
import { ReasonPhrases as PHRASES, StatusCodes as CODE} from 'http-status-codes';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

// Call this function to validate the JWT credential sent from client-side
export async function verifyCredentials(credential : string) {
  const ticket = await client.verifyIdToken({
    idToken: credential
  })
  const payload = ticket.getPayload()
  return payload
}

// Middleware to check if user is in a session
export function checkSession(req : any, res : any, next : any) {
    if (!req.session.sub) {
        return res.status(CODE.UNAUTHORIZED).send(PHRASES.UNAUTHORIZED);
    }
    next();
}

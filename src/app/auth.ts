import { OAuth2Client } from 'google-auth-library'
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

// Call this function to validate the JWT credential sent from client-side
const verifyCredentials = async (credential : string) => {
  const ticket = await client.verifyIdToken({
    idToken: credential
  })
  const payload = ticket.getPayload()
  return payload
}

export default verifyCredentials
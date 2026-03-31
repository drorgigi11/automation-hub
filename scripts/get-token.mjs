import { createServer } from 'http'
import { google } from 'googleapis'

const CLIENT_ID = process.argv[2]
const CLIENT_SECRET = process.argv[3]
const REDIRECT_URI = 'http://localhost:4242/callback'

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)

const url = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/spreadsheets'],
  prompt: 'consent',
})

console.log('\n פתח את הקישור הזה בדפדפן:')
console.log('\n' + url + '\n')

const server = createServer(async (req, res) => {
  if (!req.url?.startsWith('/callback')) return
  const code = new URL(req.url, 'http://localhost:4242').searchParams.get('code')
  if (!code) { res.end('Missing code'); return }

  try {
    const { tokens } = await oauth2Client.getToken(code)
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    res.end('<h2>✅ הצלחה! אפשר לסגור את הטאב הזה.</h2>')

    console.log('\n✅ הצלחה! הוסף ל-.env.local:\n')
    console.log(`GOOGLE_CLIENT_ID=${CLIENT_ID}`)
    console.log(`GOOGLE_CLIENT_SECRET=${CLIENT_SECRET}`)
    console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`)
  } catch (e) {
    res.end('Error: ' + e)
  } finally {
    server.close()
    process.exit(0)
  }
})

server.listen(4242, () => console.log('ממתין לקוד ב-localhost:4242...\n'))

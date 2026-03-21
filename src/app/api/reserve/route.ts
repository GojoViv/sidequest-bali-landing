import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

async function appendToSheet(name: string, email: string, source: string) {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  )
  auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN })

  const sheets = google.sheets({ version: 'v4', auth })
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: 'Sheet1!A:E',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[
        new Date().toISOString(),
        name,
        email,
        'Bali May 2026',
        source || 'website',
      ]],
    },
  })
}

async function sendNotification(name: string, email: string) {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  )
  auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN })

  const { token } = await auth.getAccessToken()
  const gmail = google.gmail({ version: 'v1', auth })

  const recipients = ['don@metastart.in', 'd0sanjana@gmail.com']
  const subject = `SideQuest signup — ${name}`
  const body = `New signup for SideQuest Bali (May 2026)\n\nName: ${name}\nEmail: ${email}\nTime: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST\n\nView all signups:\nhttps://docs.google.com/spreadsheets/d/${process.env.GOOGLE_SHEET_ID}`

  const message = [
    `From: don@metastart.in`,
    `To: ${recipients.join(', ')}`,
    `Subject: ${subject}`,
    `Content-Type: text/plain; charset=utf-8`,
    ``,
    body,
  ].join('\n')

  const encoded = Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

  void token // suppress unused warning
  await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw: encoded },
  })
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, source } = await req.json()

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email required' }, { status: 400 })
    }

    await Promise.all([
      appendToSheet(name, email, source || 'website'),
      sendNotification(name, email),
    ])

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Signup error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

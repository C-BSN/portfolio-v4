import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const { name, email, subject, type, message } = await req.json()

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Champs requis manquants.' }, { status: 400 })
  }

  const emailSubject = subject || `Demande de contact - ${type || 'Projet'}`

  const { error } = await resend.emails.send({
    from: 'Portfolio Contact <onboarding@resend.dev>',
    to: 'corentinbassonpro@gmail.com',
    replyTo: email,
    subject: emailSubject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a2f5a; border-bottom: 2px solid #c45880; padding-bottom: 10px;">
          Nouveau message de contact
        </h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; width: 140px;">Nom :</td>
            <td style="padding: 8px 0;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Email :</td>
            <td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          ${type ? `<tr><td style="padding: 8px 0; font-weight: bold;">Type de projet :</td><td style="padding: 8px 0;">${type}</td></tr>` : ''}
          ${subject ? `<tr><td style="padding: 8px 0; font-weight: bold;">Objet :</td><td style="padding: 8px 0;">${subject}</td></tr>` : ''}
        </table>
        <h3 style="color: #1a2f5a; margin-top: 20px;">Message :</h3>
        <div style="background: #f5f5f5; padding: 16px; border-left: 4px solid #c45880; white-space: pre-wrap;">
          ${message.replace(/\n/g, '<br>')}
        </div>
        <p style="color: #999; font-size: 12px; margin-top: 24px;">
          Ce message a été envoyé depuis le formulaire de contact de ton portfolio.
        </p>
      </div>
    `,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

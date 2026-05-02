interface SendVerificationEmailParams {
  email: string;
  verificationCode: string;
  verificationToken: string;
  userName: string;
}

export async function sendVerificationEmail({
  email,
  verificationCode,
  verificationToken,
  userName,
}: SendVerificationEmailParams) {
  // If no API key, return success for development
  if (!process.env.RESEND_API_KEY) {
    console.log('Email service not configured. Verification code:', verificationCode);
    return { success: true, error: null };
  }

  try {
    // Dynamic import to avoid build error
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    const verificationUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/verify?token=${verificationToken}&email=${email}`;
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #6366f1;
          }
          .header h1 {
            color: #6366f1;
            margin: 0;
            font-size: 28px;
          }
          .code {
            background-color: #f8f9fa;
            border: 2px dashed #6366f1;
            padding: 20px;
            text-align: center;
            margin: 20px 0;
            border-radius: 5px;
          }
          .code-number {
            font-size: 32px;
            font-weight: bold;
            color: #6366f1;
            letter-spacing: 5px;
            margin: 0;
          }
          .button {
            display: inline-block;
            background-color: #6366f1;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            text-align: center;
            color: #666;
            font-size: 12px;
          }
          .info-box {
            background-color: #e8f4fd;
            border-left: 4px solid #6366f1;
            padding: 15px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎓 Class 7.3</h1>
            <h2>Email Verification</h2>
          </div>
          
          <p>Halo <strong>${userName}</strong>,</p>
          <p>Terima kasih telah mendaftar di Class 7.3! Untuk mengaktifkan akun Anda, silakan verifikasi email Anda.</p>
          
          <div class="info-box">
            <p><strong>Cara Verifikasi:</strong></p>
            <p>1. Masukkan kode verifikasi berikut: <strong>${verificationCode}</strong></p>
            <p>2. Atau klik tombol di bawah ini</p>
          </div>
          
          <div class="code">
            <p class="code-number">${verificationCode}</p>
          </div>
          
          <div style="text-align: center;">
            <a href="${verificationUrl}" class="button">Verifikasi Email Sekarang</a>
          </div>
          
          <p><strong>Kode berlaku selama 24 jam.</strong></p>
          <p>Jika Anda tidak mendaftar di Class 7.3, abaikan email ini.</p>
          
          <div class="footer">
            <p>&copy; 2024 Class 7.3. All rights reserved.</p>
            <p>This is an automated message, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: [email],
      subject: 'Verifikasi Email - Class 7.3',
      html: htmlContent,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error: any) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
}

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

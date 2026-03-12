import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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
  try {
    const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL || "http://localhost:3000";
    const verificationUrl = `${baseUrl}/verify?token=${verificationToken}&email=${encodeURIComponent(email)}`;

    const htmlContent = createVerificationEmailHTML({
      verificationCode,
      verificationUrl,
      userName,
    });

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Class 7.3 <onboarding@resend.dev>",
      to: [email],
      subject: "Verify your Class 7.3 account",
      html: htmlContent,
    });

    if (error) {
      console.error("Email send error:", error);
      return { success: false, error: error.message };
    }

    console.log("Email sent successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Email service error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to send email" 
    };
  }
}

function createVerificationEmailHTML({
  verificationCode,
  verificationUrl,
  userName,
}: {
  verificationCode: string;
  verificationUrl: string;
  userName: string;
}) {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify your Class 7.3 account</title>
    <style>
        body {
            font-family: 'Inter', Arial, sans-serif;
            line-height: 1.5;
            color: #4b5563;
            background-color: #f9fafb;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background-color: #3b82f6;
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: bold;
        }
        .content {
            padding: 30px 20px;
        }
        .code-container {
            background-color: #f3f4f6;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 20px 0;
        }
        .code {
            font-size: 32px;
            font-weight: bold;
            color: #1f2937;
            letter-spacing: 8px;
            font-family: monospace;
            margin: 0;
        }
        .button {
            display: inline-block;
            background-color: #3b82f6;
            color: white;
            padding: 12px 24px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 600;
            margin: 20px 0;
        }
        .footer {
            background-color: #f9fafb;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
            font-size: 12px;
            color: #9ca3af;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Class 7.3 - Email Verification</h1>
        </div>
        
        <div class="content">
            <p>Hi ${userName},</p>
            <p>Thank you for signing up for Class 7.3! To complete your registration and activate your account, please verify your email address.</p>
            
            <h2>Verification Code</h2>
            <div class="code-container">
                <p class="code">${verificationCode}</p>
            </div>
            
            <p>Or click the button below to verify instantly:</p>
            
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
            
            <p><small>This verification link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.</small></p>
            
            <p><small>If the button doesn't work, you can copy and paste this link into your browser:</small></p>
            <p><small><a href="${verificationUrl}">${verificationUrl}</a></small></p>
        </div>
        
        <div class="footer">
            <p>© 2024 Class 7.3. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
  `;
}

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

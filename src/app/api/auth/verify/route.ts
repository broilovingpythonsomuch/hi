import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendVerificationEmail, generateVerificationCode } from "@/lib/email";
import { generateVerificationToken } from "@/lib/crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, email, code } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const sanitizedEmail = email.toLowerCase().trim();

    const user = await db.user.findUnique({
      where: { email: sanitizedEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid verification link" },
        { status: 400 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json({
        message: "Email already verified. You can now sign in.",
      });
    }

    // Verify with token (from email link) or code (from email)
    let isValid = false;

    if (token && user.verificationToken === token) {
      isValid = true;
    } else if (code && user.verificationCode === code) {
      isValid = true;
    }

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid verification token or code" },
        { status: 400 }
      );
    }

    if (user.tokenExpiry && new Date() > user.tokenExpiry) {
      return NextResponse.json(
        { error: "Verification link has expired" },
        { status: 400 }
      );
    }

    // Update user as verified
    await db.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
        verificationCode: null,
        tokenExpiry: null,
      },
    });

    return NextResponse.json({
      message: "Email verified successfully. You can now sign in.",
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}

// Resend verification email
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const sanitizedEmail = email.toLowerCase().trim();

    const user = await db.user.findUnique({
      where: { email: sanitizedEmail },
    });

    if (!user) {
      // Don't reveal if email exists
      return NextResponse.json({
        message: "If an account exists, a new verification email has been sent.",
      });
    }

    if (user.emailVerified) {
      return NextResponse.json({
        message: "Email already verified. You can sign in.",
      });
    }

    // Generate new token and code
    const verificationToken = generateVerificationToken();
    const verificationCode = generateVerificationCode();
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await db.user.update({
      where: { id: user.id },
      data: {
        verificationToken,
        verificationCode,
        tokenExpiry,
      },
    });

    // Send new verification email
    try {
      const emailResult = await sendVerificationEmail({
        email: sanitizedEmail,
        verificationCode,
        verificationToken,
        userName: user.name,
      });

      if (!emailResult.success) {
        console.error("Email send error:", emailResult.error);
        // Don't fail the request, but log the error
        return NextResponse.json({
          message: "Verification code generated. Email delivery failed - check console for details.",
          verificationCode, // Include code in development
        });
      }
    } catch (emailError) {
      console.error("Email service error:", emailError);
      // Don't fail the request, but return the code for development
      return NextResponse.json({
        message: "Verification code generated. Email service unavailable.",
        verificationCode, // Include code in development
      });
    }

    return NextResponse.json({
      message: "New verification email sent",
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { error: "Failed to resend verification email" },
      { status: 500 }
    );
  }
}

// Resend verification email
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const sanitizedEmail = email.toLowerCase().trim();

    const user = await db.user.findUnique({
      where: { email: sanitizedEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json({
        message: "Email already verified. You can now sign in.",
      });
    }

    // Generate new token and code
    const verificationToken = generateVerificationToken();
    const verificationCode = generateVerificationCode();
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await db.user.update({
      where: { id: user.id },
      data: {
        verificationToken,
        verificationCode,
        tokenExpiry,
      },
    });

    // Send new verification email
    try {
      const emailResult = await sendVerificationEmail({
        email: sanitizedEmail,
        verificationCode,
        verificationToken,
        userName: user.name,
      });

      if (!emailResult.success) {
        console.error("Email send error:", emailResult.error);
        // Don't fail the request, but log the error
        return NextResponse.json({
          message: "Verification code generated. Email delivery failed - check console for details.",
          verificationCode, // Include code in development
        });
      }
    } catch (emailError) {
      console.error("Email service error:", emailError);
      // Don't fail the request, but return the code for development
      return NextResponse.json({
        message: "Verification code generated. Email service unavailable.",
        verificationCode, // Include code in development
      });
    }

    return NextResponse.json({
      message: "New verification email sent",
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { error: "Failed to resend verification email" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  hashPassword,
  generateVerificationToken,
  isValidEmail,
  validatePassword,
  sanitizeInput,
} from "@/lib/crypto";
import { sendVerificationEmail, generateVerificationCode } from "@/lib/email";

// Rate limiting store (in-memory, resets on server restart)
const rateLimitStore = new Map<string, { count: number; lastAttempt: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_ATTEMPTS = 5;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record) {
    rateLimitStore.set(ip, { count: 1, lastAttempt: now });
    return true;
  }

  if (now - record.lastAttempt > RATE_LIMIT_WINDOW) {
    rateLimitStore.set(ip, { count: 1, lastAttempt: now });
    return true;
  }

  if (record.count >= MAX_ATTEMPTS) {
    return false;
  }

  record.count++;
  record.lastAttempt = now;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") ||
               request.headers.get("x-real-ip") ||
               "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, password, confirmPassword } = body;

    // Input validation
    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = email.toLowerCase().trim();

    // Validate email
    if (!isValidEmail(sanitizedEmail)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Validate name length
    if (sanitizedName.length < 2 || sanitizedName.length > 100) {
      return NextResponse.json(
        { error: "Name must be between 2 and 100 characters" },
        { status: 400 }
      );
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.message },
        { status: 400 }
      );
    }

    // Check password confirmation
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: sanitizedEmail },
    });

    if (existingUser) {
      // Don't reveal if email exists (security)
      return NextResponse.json(
        { error: "Unable to create account. Please try a different email." },
        { status: 400 }
      );
    }

    // Generate verification token and code
    const verificationToken = generateVerificationToken();
    const verificationCode = generateVerificationCode();
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Hash password and create user
    const hashedPassword = hashPassword(password);

    const user = await db.user.create({
      data: {
        name: sanitizedName,
        email: sanitizedEmail,
        password: hashedPassword,
        role: "MEMBER",
        emailVerified: false,
        verificationToken,
        verificationCode,
        tokenExpiry,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${sanitizedEmail}`,
      },
    });

    // Send verification email
    const emailResult = await sendVerificationEmail({
      email: sanitizedEmail,
      verificationCode,
      verificationToken,
      userName: sanitizedName,
    });

    if (!emailResult.success) {
      console.error("Failed to send verification email:", emailResult.error);
      // Don't fail the signup, but log the error
    }

    return NextResponse.json({
      message: "Account created successfully. Please check your email for verification instructions.",
      userId: user.id,
      emailSent: emailResult.success,
      // Include verification code for development/testing
      verificationCode: process.env.NODE_ENV === "development" ? verificationCode : undefined,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}

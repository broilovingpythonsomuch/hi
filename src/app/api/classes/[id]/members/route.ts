import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-config";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const members = await db.classMember.findMany({
      where: { classId: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
            emailVerified: true,
          }
        }
      },
      orderBy: [
        { position: 'asc' },
        { number: 'asc' },
        { joinedAt: 'asc' }
      ]
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error("Error fetching class members:", error);
    return NextResponse.json(
      { error: "Failed to fetch class members" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SEKRETARIS")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { userId, position, number } = body;

    if (!userId || !position) {
      return NextResponse.json(
        { error: "User ID and position are required" },
        { status: 400 }
      );
    }

    // Check if user is already a member
    const existingMember = await db.classMember.findUnique({
      where: {
        userId_classId: {
          userId,
          classId: params.id
        }
      }
    });

    if (existingMember) {
      return NextResponse.json(
        { error: "User is already a member of this class" },
        { status: 400 }
      );
    }

    const newMember = await db.classMember.create({
      data: {
        userId,
        classId: params.id,
        position,
        number: number || null,
        status: "active",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
          }
        }
      }
    });

    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.error("Error adding class member:", error);
    return NextResponse.json(
      { error: "Failed to add class member" },
      { status: 500 }
    );
  }
}

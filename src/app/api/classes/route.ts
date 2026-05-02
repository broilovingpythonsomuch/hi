import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-config";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const classes = await db.classInfo.findMany({
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              }
            }
          },
          orderBy: {
            number: 'asc'
          }
        },
        _count: {
          select: {
            members: true,
            payments: true,
            activities: true,
            announcements: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(classes);
  } catch (error) {
    console.error("Error fetching classes:", error);
    return NextResponse.json(
      { error: "Failed to fetch classes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SEKRETARIS")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, year, semester } = body;

    if (!name || !year || !semester) {
      return NextResponse.json(
        { error: "Name, year, and semester are required" },
        { status: 400 }
      );
    }

    const newClass = await db.classInfo.create({
      data: {
        name,
        description,
        year,
        semester,
        isActive: true,
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              }
            }
          }
        }
      }
    });

    return NextResponse.json(newClass, { status: 201 });
  } catch (error) {
    console.error("Error creating class:", error);
    return NextResponse.json(
      { error: "Failed to create class" },
      { status: 500 }
    );
  }
}

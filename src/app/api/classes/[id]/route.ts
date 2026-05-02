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

    const classInfo = await db.classInfo.findUnique({
      where: { id: params.id },
      include: {
        members: {
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
        },
        payments: {
          orderBy: {
            createdAt: 'desc'
          }
        },
        activities: {
          orderBy: {
            date: 'desc'
          }
        },
        announcements: {
          orderBy: {
            createdAt: 'desc'
          }
        },
        schedules: {
          orderBy: {
            date: 'asc'
          }
        }
      }
    });

    if (!classInfo) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    return NextResponse.json(classInfo);
  } catch (error) {
    console.error("Error fetching class:", error);
    return NextResponse.json(
      { error: "Failed to fetch class" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SEKRETARIS")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, year, semester, isActive } = body;

    const updatedClass = await db.classInfo.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(year && { year }),
        ...(semester && { semester }),
        ...(isActive !== undefined && { isActive }),
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

    return NextResponse.json(updatedClass);
  } catch (error) {
    console.error("Error updating class:", error);
    return NextResponse.json(
      { error: "Failed to update class" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await db.classInfo.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: "Class deleted successfully" });
  } catch (error) {
    console.error("Error deleting class:", error);
    return NextResponse.json(
      { error: "Failed to delete class" },
      { status: 500 }
    );
  }
}

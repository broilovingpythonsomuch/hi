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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const whereClause: any = { classId: params.id };
    if (status) whereClause.status = status;

    const meetings = await db.meetingMinutes.findMany({
      where: whereClause,
      include: {
        secretary: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });

    return NextResponse.json(meetings);
  } catch (error) {
    console.error("Error fetching meeting minutes:", error);
    return NextResponse.json(
      { error: "Failed to fetch meeting minutes" },
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
    const { 
      title, 
      date, 
      location, 
      agenda, 
      decisions, 
      actionItems, 
      attendees 
    } = body;

    if (!title || !date || !location) {
      return NextResponse.json(
        { error: "Title, date, and location are required" },
        { status: 400 }
      );
    }

    const meeting = await db.meetingMinutes.create({
      data: {
        title,
        date: new Date(date),
        location,
        agenda: agenda || [],
        decisions: decisions || [],
        actionItems: actionItems || [],
        attendees: attendees || [],
        classId: params.id,
        secretaryId: session.user.id,
        status: "DRAFT",
      },
      include: {
        secretary: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          }
        }
      }
    });

    return NextResponse.json(meeting, { status: 201 });
  } catch (error) {
    console.error("Error creating meeting minutes:", error);
    return NextResponse.json(
      { error: "Failed to create meeting minutes" },
      { status: 500 }
    );
  }
}

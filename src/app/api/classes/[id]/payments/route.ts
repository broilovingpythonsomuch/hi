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
    const type = searchParams.get('type');

    const whereClause: any = { classId: params.id };
    if (status) whereClause.status = status;
    if (type) whereClause.type = type;

    const payments = await db.payment.findMany({
      where: whereClause,
      include: {
        paidByUser: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          }
        },
        member: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
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
    
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "BENDAHARA")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { 
      title, 
      amount, 
      type, 
      dueDate, 
      description, 
      targetMembers 
    } = body;

    if (!title || !amount || !dueDate) {
      return NextResponse.json(
        { error: "Title, amount, and due date are required" },
        { status: 400 }
      );
    }

    // Create payments for each target member or for all members
    const classMembers = await db.classMember.findMany({
      where: { 
        classId: params.id,
        status: "active"
      }
    });

    const targetMemberIds = targetMembers || classMembers.map(m => m.id);

    const payments = await db.payment.createMany({
      data: targetMemberIds.map((memberId: string) => ({
        title,
        amount: parseFloat(amount),
        type: type || "REGULAR",
        status: "PENDING",
        dueDate: new Date(dueDate),
        description,
        classId: params.id,
        memberPaidBy: memberId,
      }))
    });

    return NextResponse.json({ 
      message: "Payments created successfully",
      count: payments.count 
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating payments:", error);
    return NextResponse.json(
      { error: "Failed to create payments" },
      { status: 500 }
    );
  }
}

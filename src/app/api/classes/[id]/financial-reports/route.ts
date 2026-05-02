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
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    const whereClause: any = { classId: params.id };
    if (type) whereClause.type = type;
    if (status) whereClause.status = status;

    const reports = await db.financialReport.findMany({
      where: whereClause,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          }
        },
        details: {
          orderBy: {
            date: 'desc'
          }
        },
        _count: {
          select: {
            details: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error("Error fetching financial reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch financial reports" },
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
      period, 
      type, 
      income, 
      expense, 
      description,
      details 
    } = body;

    if (!title || !period || !type) {
      return NextResponse.json(
        { error: "Title, period, and type are required" },
        { status: 400 }
      );
    }

    const balance = (parseFloat(income || 0) - parseFloat(expense || 0)).toString();

    const report = await db.financialReport.create({
      data: {
        title,
        period,
        type,
        income: parseFloat(income || 0),
        expense: parseFloat(expense || 0),
        balance: parseFloat(balance),
        description,
        classId: params.id,
        createdById: session.user.id,
        status: "DRAFT",
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          }
        }
      }
    });

    // Add details if provided
    if (details && details.length > 0) {
      await db.financialReportDetail.createMany({
        data: details.map((detail: any) => ({
          reportId: report.id,
          category: detail.category,
          description: detail.description,
          amount: parseFloat(detail.amount),
          date: new Date(detail.date),
          receiptUrl: detail.receiptUrl,
          notes: detail.notes,
        }))
      });
    }

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error("Error creating financial report:", error);
    return NextResponse.json(
      { error: "Failed to create financial report" },
      { status: 500 }
    );
  }
}

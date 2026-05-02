import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-config";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "BENDAHARA")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { status, paidDate, paymentMethod, paidBy } = body;

    const updatedPayment = await db.payment.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(paidDate && { paidDate: new Date(paidDate) }),
        ...(paymentMethod && { paymentMethod }),
        ...(paidBy && { paidBy }),
      },
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
      }
    });

    return NextResponse.json(updatedPayment);
  } catch (error) {
    console.error("Error updating payment:", error);
    return NextResponse.json(
      { error: "Failed to update payment" },
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
    
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "BENDAHARA")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await db.payment.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: "Payment deleted successfully" });
  } catch (error) {
    console.error("Error deleting payment:", error);
    return NextResponse.json(
      { error: "Failed to delete payment" },
      { status: 500 }
    );
  }
}

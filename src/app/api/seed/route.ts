import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, generateVerificationToken } from "@/lib/crypto";

export async function GET() {
  try {
    // Check if already seeded
    const existingClasses = await db.classInfo.count();
    if (existingClasses > 0) {
      return NextResponse.json({ message: "Database already seeded" });
    }

    // Create verified admin user
    const adminPassword = hashPassword("imthedeveloper");
    const admin = await db.user.create({
      data: {
        name: "Hari Baik",
        email: "hari.baik202@gmail.com",
        password: adminPassword,
        role: "ADMIN",
        emailVerified: true,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=haribaik",
      },
    });

    // Create verified admin/designer user
    const designerPassword = hashPassword("imthedesigner");
    const designer = await db.user.create({
      data: {
        name: "Web Developer",
        email: "web73dev@gmail.com",
        password: designerPassword,
        role: "ADMIN",
        emailVerified: true,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=web73dev",
      },
    });

    // Create bendahara user
    const bendaharaPassword = hashPassword("bendahara123");
    const bendahara = await db.user.create({
      data: {
        name: "Ahmad Bendahara",
        email: "bendahara@class73.com",
        password: bendaharaPassword,
        role: "BENDAHARA",
        emailVerified: true,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bendahara",
      },
    });

    // Create sekretaris user
    const sekretarisPassword = hashPassword("sekretaris123");
    const sekretaris = await db.user.create({
      data: {
        name: "Siti Sekretaris",
        email: "sekretaris@class73.com",
        password: sekretarisPassword,
        role: "SEKRETARIS",
        emailVerified: true,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sekretaris",
      },
    });

    // Create sample member (unverified for demo)
    const memberToken = generateVerificationToken();
    const memberPassword = hashPassword("member123");
    const member = await db.user.create({
      data: {
        name: "Demo Member",
        email: "member@class.com",
        password: memberPassword,
        role: "MEMBER",
        emailVerified: false,
        verificationToken: memberToken,
        tokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=demomember",
      },
    });

    // Create class
    const classInfo = await db.classInfo.create({
      data: {
        name: "Kelas 7.3",
        description: "Kelas terbaik di sekolah",
        year: "2024/2025",
        semester: "Ganjil",
        isActive: true,
      },
    });

    // Add class members with positions
    const classMembers = await Promise.all([
      // Ketua Kelas
      db.classMember.create({
        data: {
          userId: admin.id,
          classId: classInfo.id,
          position: "KETUA_KELAS",
          number: 1,
          status: "active",
        },
      }),
      // Wakil Ketua
      db.classMember.create({
        data: {
          userId: designer.id,
          classId: classInfo.id,
          position: "WAKIL_KETUA",
          number: 2,
          status: "active",
        },
      }),
      // Sekretaris
      db.classMember.create({
        data: {
          userId: sekretaris.id,
          classId: classInfo.id,
          position: "SEKRETARIS",
          number: 3,
          status: "active",
        },
      }),
      // Bendahara
      db.classMember.create({
        data: {
          userId: bendahara.id,
          classId: classInfo.id,
          position: "BENDAHARA",
          number: 4,
          status: "active",
        },
      }),
      // Regular member
      db.classMember.create({
        data: {
          userId: member.id,
          classId: classInfo.id,
          position: "MEMBER",
          number: 5,
          status: "active",
        },
      }),
    ]);

    // Create sample payments
    const payments = await Promise.all([
      db.payment.create({
        data: {
          title: "Iuran SPP September",
          amount: 50000,
          type: "REGULAR",
          status: "PENDING",
          dueDate: new Date("2024-09-30"),
          description: "Iuran bulanan untuk keperluan kelas",
          classId: classInfo.id,
          memberPaidBy: classMembers[4].id,
        },
      }),
      db.payment.create({
        data: {
          title: "Kas Kas Kelas",
          amount: 25000,
          type: "SPECIAL",
          status: "PAID",
          dueDate: new Date("2024-09-15"),
          paidDate: new Date("2024-09-14"),
          paymentMethod: "Transfer",
          description: "Kas tambahan untuk acara 17 Agustus",
          classId: classInfo.id,
          memberPaidBy: classMembers[3].id,
          paidBy: bendahara.id,
        },
      }),
    ]);

    // Create sample activities
    const activities = await Promise.all([
      db.activity.create({
        data: {
          title: "Rapat Rutinan Bulanan",
          description: "Rapat untuk membahas program bulan ini",
          type: "MEETING",
          date: new Date("2024-09-20"),
          location: "Ruang Kelas 7.3",
          status: "PLANNED",
          budget: 100000,
          actualCost: null,
          classId: classInfo.id,
          organizerId: admin.id,
          participants: [admin.id, designer.id, sekretaris.id, bendahara.id],
        },
      }),
      db.activity.create({
        data: {
          title: "Study Tour ke Museum",
          description: "Kunjungan edukatif ke museum nasional",
          type: "ACADEMIC",
          date: new Date("2024-10-05"),
          location: "Museum Nasional Jakarta",
          status: "PLANNED",
          budget: 500000,
          actualCost: null,
          classId: classInfo.id,
          organizerId: designer.id,
          participants: [],
        },
      }),
    ]);

    // Create sample announcements
    const announcements = await Promise.all([
      db.announcement.create({
        data: {
          title: "Pengumuman: Libur Semester Ganjil",
          content: "Diberitahukan kepada seluruh siswa kelas 7.3 bahwa libur semester ganjil akan dimulai pada tanggal 23 Desember 2024.",
          type: "GENERAL",
          priority: "high",
          isPinned: true,
          status: "ACTIVE",
          classId: classInfo.id,
          authorId: admin.id,
          tags: ["libur", "semester", "pengumuman"],
          expiresAt: new Date("2024-12-31"),
        },
      }),
      db.announcement.create({
        data: {
          title: "Pembayaran SPP Bulan Oktober",
          content: "Seluruh siswa diharapkan melunaskan pembayaran SPP bulan Oktober paling lambat tanggal 31 Oktober 2024.",
          type: "FINANCIAL",
          priority: "normal",
          isPinned: false,
          status: "ACTIVE",
          classId: classInfo.id,
          authorId: bendahara.id,
          tags: ["pembayaran", "spp", "oktober"],
        },
      }),
    ]);

    // Create sample schedules
    const schedules = await Promise.all([
      db.schedule.create({
        data: {
          title: "Matematika",
          description: "Pelajaran Matematika dengan Pak Budi",
          type: "LESSON",
          date: new Date("2024-09-16"),
          startTime: "07:00",
          endTime: "08:30",
          location: "Ruang Kelas 7.3",
          status: "SCHEDULED",
          classId: classInfo.id,
        },
      }),
      db.schedule.create({
        data: {
          title: "Rapat OSIS",
          description: "Rapat rutinan OSIS kelas 7.3",
          type: "MEETING",
          date: new Date("2024-09-20"),
          startTime: "13:00",
          endTime: "14:00",
          location: "Ruang OSIS",
          status: "SCHEDULED",
          classId: classInfo.id,
        },
      }),
    ]);

    return NextResponse.json({
      message: "Database seeded successfully",
      data: {
        users: 5,
        class: 1,
        members: 5,
        payments: 2,
        activities: 2,
        announcements: 2,
        schedules: 2,
      },
    });
  } catch (error: any) {
    console.error("Seeding error:", error);
    return NextResponse.json(
      { error: "Failed to seed database", details: error.message },
      { status: 500 }
    );
  }
}

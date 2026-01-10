import { NextResponse } from "next/server";
import { db } from "@/db";
import { participants } from "@/db/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      applicantName,
      fathersName,
      gender,
      age,
      mobile,
      emergencyContactNumber,
      emergencyContactName,
      villageTown,
      postOffice,
      policeStation,
      district,
    } = body;

    // Basic Validation
    if (!applicantName || !mobile || !gender || !age) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert into Neon DB via Drizzle
    await db.insert(participants).values({
      applicantName,
      fathersName,
      gender,
      age: parseInt(age), // Ensure integer
      mobile,
      emergencyContactNumber,
      emergencyContactName,
      villageTown,
      postOffice,
      policeStation,
      district,
    });

    return NextResponse.json({
      success: true,
      message: "Registration successful",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

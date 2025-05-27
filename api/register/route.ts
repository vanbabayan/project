import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";


export async function POST(request: Request){
    const {email, password, name} = await request.json();
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
        data: {email, password: hashedPassword, name},
    });
    return NextResponse.json({user});
}
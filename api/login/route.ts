// где-то в вашем login-роуте
import { NextResponse } from "next/server";
import { signToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { comparePassword } from '@/lib/auth';

export async function POST(request: Request) {

  const { email, password } = await request.json();
 
  const user = await prisma.user.findUnique({ where: { email } });
 
  if (!user || !(await comparePassword(password, user.password))) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // **Здесь важно**: дождаться токена
  const token = await signToken(user.id);

  // Устанавливаем куку с уже готовой строкой токена
  cookies().set({
    name: 'token',
    value: token,
    httpOnly: true,
    path: '/',
    maxAge: 2 * 60 * 60, // 2 часа в секундах
  });

  return NextResponse.json({ success: true });
}


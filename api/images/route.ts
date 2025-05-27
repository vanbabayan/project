// app/api/images/route.ts
import { NextResponse } from 'next/server'
import  prisma  from '@/lib/prisma'
import { getCurrentUser } from "@/lib/auth";


export async function GET(request: Request) {
  const url = new URL(request.url)
  const id = url.searchParams.get('id')
  const sliderId = url.searchParams.get('sliderId')
  const postId = url.searchParams.get('postId')

  if (id) {
    // Read one image
    const image = await prisma.image.findUnique({ where: { id } })
    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }
    return NextResponse.json(image)
  }

  if (sliderId) {
    // Read all images for a given slider
    const images = await prisma.image.findMany({
      where: { sliderId },
      orderBy: { createdAt: 'asc' },
    })
    return NextResponse.json(images)
  }

  if (postId) {
    // Read all images for a given post
    const images = await prisma.image.findMany({
      where: { postId },
      orderBy: { createdAt: 'asc' },
    })
    return NextResponse.json(images)
  }

  // Read all images
  const images = await prisma.image.findMany({
    orderBy: { createdAt: 'asc' },
  })
  return NextResponse.json(images)
}

export async function POST(request: Request) {

  const user = await getCurrentUser();
  if(!user) return NextResponse.json({error: 'Unauthorized'}, {status: 401});

  // Create a new image
  const { filename, url, size, sliderId, postId } = await request.json()
  try {
    const image = await prisma.image.create({
      data: { filename, url, size, sliderId, postId },
    })
    return NextResponse.json(image, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}

export async function PUT(request: Request) {

  const user = await getCurrentUser();
  if(!user) return NextResponse.json({error: 'Unauthorized'}, {status: 401});


  // Update an image record
  const { id, filename, url, size, sliderId, postId } = await request.json()
  try {
    const image = await prisma.image.update({
      where: { id },
      data: { filename, url, size, sliderId, postId },
    })
    return NextResponse.json(image)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}

export async function DELETE(request: Request) {

  const user = await getCurrentUser();
  if(!user) return NextResponse.json({error: 'Unauthorized'}, {status: 401});

  // Delete an image
  const { id } = await request.json()
  try {
    await prisma.image.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}

// app/api/images/upload/route.ts
import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import prisma from '@/lib/prisma'

export const config = { api: { bodyParser: false } }

export async function POST(request: Request) {
  const formData = await request.formData()
  const fileField = formData.get('file')
  const topBannerIdRaw = formData.get('topBannerId')?.toString()
  const postIdRaw   = formData.get('postId')?.toString()

  if (!(fileField instanceof File)) {
    return NextResponse.json({ error: 'No file uploaded under “file” key' }, { status: 400 })
  }

  // 1) Validate sliderId, postId
  let topbannerId: string | undefined
  if (topBannerIdRaw) {
    const topBanner = await prisma.topBanner.findUnique({ where: { id: topBannerIdRaw } })
    if (!topBanner) {
      return NextResponse.json({ error: `topBannerId ${topBannerIdRaw} not found` }, { status: 400 })
    }
    topbannerId = topBannerIdRaw
  }

  let postId: string | undefined
  if (postIdRaw) {
    const post = await prisma.post.findUnique({ where: { id: postIdRaw } })
    if (!post) {
      return NextResponse.json({ error: `postId ${postIdRaw} not found` }, { status: 400 })
    }
    postId = postIdRaw
  }

  // 2) Save file
  const arrayBuffer = await fileField.arrayBuffer()
  const buffer      = Buffer.from(arrayBuffer)
  const filename    = `${Date.now()}-${fileField.name}`
  const uploadDir   = path.join(process.cwd(), 'public', 'uploads')
  await fs.promises.mkdir(uploadDir, { recursive: true })
  await fs.promises.writeFile(path.join(uploadDir, filename), buffer)
  const publicUrl = `/uploads/${filename}`

  // 3) Create DB record only with valid FKs
  const image = await prisma.image.create({
    data: {
      filename: fileField.name,
      url:      publicUrl,
      size:     fileField.size,
      // only include sliderId or postId if validated
      ...(topbannerId ? { topbannerId } : {}),
      ...(postId   ? { postId   } : {}),
    },
  })

  return NextResponse.json(image, { status: 201 })
}




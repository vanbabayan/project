import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";


export async function GET(request: Request){

    const topBanner = await prisma.topBanner.findMany({
        orderBy: {order: 'asc'},
        include: {images: true}
    });

    if(!topBanner)
        return NextResponse.json({error: "TopBanner Not Found"}, {status: 404});

    return NextResponse.json(topBanner)
}


export async function POST(request: Request) {

  const user = await getCurrentUser();
  if(!user) return NextResponse.json({error: 'Unauthorized'}, {status: 401});

    // Create a new slider
    const { name, description, order, fb_link, inst_link, linkedin_link } = await request.json()
    try {
      const slider = await prisma.topBanner.create({
        data: { name, description, order, fb_link,  inst_link, linkedin_link},
      })
      return NextResponse.json(slider, { status: 201 })
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
  }


  export async function PUT(request: Request) {

    const user = await getCurrentUser();
    if(!user) return NextResponse.json({error: 'Unauthorized'}, {status: 401});

    // Update existing slider
    const { id, name, description, order, fb_link, inst_link, linkedin_link } = await request.json()
    try {
      const slider = await prisma.topBanner.update({
        where: { id },
        data: { name, description, order, fb_link, inst_link, linkedin_link },
      })
      return NextResponse.json(slider)
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 400 })
    }
  }
  
  
  export async function DELETE(request: Request) {

    const user = await getCurrentUser();
    if(!user) return NextResponse.json({error: 'Unauthorized'}, {status: 401});

    // Delete a slider
    const { id } = await request.json()
    try {
      await prisma.topBanner.delete({ where: { id } })
      return NextResponse.json({ success: true })
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 400 })
    }
  }
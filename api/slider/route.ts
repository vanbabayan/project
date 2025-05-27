import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";


export async function GET(request: Request){
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if(id){
        const slider = await prisma.slider.findUnique({
            where: {id},
            include: {images: true}
        })
        if(!slider)
                return NextResponse.json({error: "Slider Not Found"}, {status: 404});
        return NextResponse.json(slider);
    }

    const sliders = await prisma.slider.findMany({
        orderBy: {order: 'asc'},
        include: {images: true}
    });

    return NextResponse.json(sliders)
}


export async function POST(request: Request) {


  const user = await getCurrentUser();
  if(!user) return NextResponse.json({error: 'Unauthorized'}, {status: 401});

    // Create a new slider
    const { name, description, order } = await request.json()
    try {
      const slider = await prisma.slider.create({
        data: { name, description, order },
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
    const { id, name, description, order } = await request.json()
    try {
      const slider = await prisma.slider.update({
        where: { id },
        data: { name, description, order },
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
      await prisma.slider.delete({ where: { id } })
      return NextResponse.json({ success: true })
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 400 })
    }
  }
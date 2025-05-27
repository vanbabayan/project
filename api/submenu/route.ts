import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";


export async function GET(request: Request) {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const menuId = url.searchParams.get('menuId');

    if (id) {
        const item = await prisma.submenu.findUnique({
          where: { id },
        });
        if (!item) return NextResponse.json({ error: "Not Found" }, { status: 404 });
        return NextResponse.json(item);
    }

    if (menuId) {
        // Все Submenu для заданного Menu
        const items = await prisma.submenu.findMany({
          where: { menuId },
          orderBy: { order: "asc" },
        });
        return NextResponse.json(items);
      }


    const all = await prisma.submenu.findMany({
        orderBy: { order: "asc" },
    });
    return NextResponse.json(all);  

}

export async function POST(request: Request) {

    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401});


    const {title, href, order, menuId} = await request.json();
    try{

        const item = await prisma.submenu.create({
            data: {title, href, order, menuId}
        });
        return NextResponse.json(item, {status: 201});

    }catch(err: any){
        return NextResponse.json( {error: err.message}, {status: 400} );
    }
}


export async function PUT(request: Request) {


    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401});


    const {id, title, href, order, menuId} = await request.json();
    try{

        const item = await prisma.submenu.update({
            where: { id },
            data: {title, href, order, menuId}
        })
        return NextResponse.json(item);

    }catch(err: any){ // {name: Error, message: '', stack: ''}
        return NextResponse.json({ error: err.message }, { status: 400 });
    }
}

export async function DELETE(request: Request) {

    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401});

    // Удаляем Submenu
    const { id } = await request.json();
    try {

      await prisma.submenu.delete({ where: { id } });
      return NextResponse.json({ success: true });
    
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
  }
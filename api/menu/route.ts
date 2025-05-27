import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";


export async function GET(request: Request){
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if(id){
        const item = await prisma.menu.findUnique({
            where: {id}
        });
        if(!item) return NextResponse.json({error: 'Not Found'}, {status: 404});
        return NextResponse.json(item);
    }

    const items = await prisma.menu.findMany({
        orderBy: {order: 'asc'}
    });
    return NextResponse.json(items);
}


export async function POST(request: Request) {

    const user = await getCurrentUser();
    if(!user) return NextResponse.json({error: 'Unauthorized'}, {status: 401});

    const {title, href, order} = await request.json();
    try{
        const item = await prisma.menu.create({
            data: {
                title,
                href,
                order: order,
            }
        });

        return NextResponse.json({item}, {status: 201});
    }catch(err: any){
        return NextResponse.json({error: err.message}, {status: 400});
    }
}

export async function PUT(request: Request){

    const user = await getCurrentUser();
    if(!user) return NextResponse.json({error: 'Unauthorized'}, {status: 401});

    const {id, title, href, order} = await request.json();
    try{
        const item = await prisma.menu.update({
            where: {id},
            data: {
                title,
                href,
                order,
            }
        });
        return NextResponse.json(item);

    }catch(err: any){
        return NextResponse.json({error: err.message}, {status: 400});
    }
}

export async function DELETE(request: Request){

    const user = await getCurrentUser();
    if(!user) return NextResponse.json({error: 'Unauthorized'}, {status: 401});

    const { id } = await request.json();

    try{
        const item = await prisma.menu.delete({
            where: {id}
        });
        return NextResponse.json({succcess: true});

    }catch(err: any){
        return NextResponse.json({error: err.message}, {status: 400});
    }
}
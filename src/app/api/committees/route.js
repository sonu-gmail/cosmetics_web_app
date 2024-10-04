import { NextResponse } from "next/server";

export async function POST(req, res) {

    let apiUrl = process.env.NEXT_PUBLIC_API_URL+'/committees';
    let response = await fetch(apiUrl, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
        }
    })

    response = await response.json();

    return NextResponse.json(response);
}
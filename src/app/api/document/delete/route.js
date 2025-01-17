import { NextResponse } from "next/server";
import { getServerAuthSession } from "../../auth/auth";

export async function POST(req, res) {
    const authSession = await getServerAuthSession();
    const {id} = await req.json()
    if(authSession?.accessToken) {

        let apiUrl = process.env.NEXT_PUBLIC_API_URL+'/document/delete/'+id;
        let response = await fetch(apiUrl, {
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                Authorization: `Bearer ${authSession?.accessToken}`,
            }
        })

        response = await response.json();

        return NextResponse.json(response)

    }
}
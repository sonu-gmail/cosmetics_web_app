import { NextResponse } from "next/server";
import { getServerAuthSession } from "../../../../api/auth/auth";

export async function GET(request, { params }) {
    const { id } = params
    const authSession = await getServerAuthSession();

    if(authSession?.accessToken) {

        let apiUrl = process.env.NEXT_PUBLIC_API_URL+'/issue/'+id;
        let response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                Authorization: `Bearer ${authSession?.accessToken}`,
            }
        })

        response = await response.json();

        return NextResponse.json(response)

    }
}
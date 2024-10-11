import { NextResponse } from "next/server";
import { getServerAuthSession } from "../auth/auth";

export async function GET(req, res) {
    const authSession = await getServerAuthSession();
    if(authSession?.accessToken) {

        let apiUrl = process.env.NEXT_PUBLIC_API_URL+'/show/profile';
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
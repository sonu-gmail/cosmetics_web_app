import { NextResponse } from "next/server";
import { getServerAuthSession } from "../../auth/auth";

export async function POST(req, res) {
    const authSession = await getServerAuthSession();
    const Formdata = await req.formData()
    if(authSession?.accessToken) {

        let apiUrl = process.env.NEXT_PUBLIC_API_URL+'/member/store/';
        let response = await fetch(apiUrl, {
            method: "POST",
            body: Formdata,
            headers: {
                'Accept': 'application/json',
                Authorization: `Bearer ${authSession?.accessToken}`,
            }
        })

        response = await response.json();

        return NextResponse.json(response)

    }
}
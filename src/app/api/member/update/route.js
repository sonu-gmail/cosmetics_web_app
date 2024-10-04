import { NextResponse } from "next/server";
import { getServerAuthSession } from "../../auth/auth";

export async function POST(req, res) {
    const authSession = await getServerAuthSession();
    const Formdata = await req.formData()
    let id = Formdata.get('id');
    if(authSession?.accessToken) {

        let apiUrl = process.env.NEXT_PUBLIC_API_URL+'/member/update/'+id;
        let response = await fetch(apiUrl, {
            method: "PATCH",
            body: new URLSearchParams(Formdata),
            headers: {
                'Accept': 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
                Authorization: `Bearer ${authSession?.accessToken}`,
            }
        })

        response = await response.json();

        return NextResponse.json(response)

    }
}
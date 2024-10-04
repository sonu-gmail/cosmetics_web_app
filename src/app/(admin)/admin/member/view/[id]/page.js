"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Action from "../../../../../lib/action";

const MemberView = ({params}) => {

    const [member, setMember] = useState('');

    useEffect(() => {
        Action.getMemberDetail(params.id).then((data) => {
            console.log(data);
            if(data.success == true)
            {
                setMember(data.data);
            }
        }).catch((error) => {
            toast.error('unable to get member Detail');
            console.log(error);
        });
    },[])

    console.log(member);
    return (
        <>
            <div className="border-b mb-8">
                <h1 className="text-3xl text-[#002855] font-light pb-5"> View Member</h1>
            </div>
            <div className="flex justify-end text-center">
                <Link href={`/admin/member/listing`} className="w-44 py-2 px-6 bg-primary flex items-center justify-center font-medium">Back</Link>
            </div>
            <div className="mt-8">
                <table className="border w-full">
                    <tbody>
                        <tr>
                            <th className="text-left w-72 py-4 px-4 uppercase text-sm text-[#002858] font-normal">First Name:</th>
                            <td>{member.first_name}</td>
                        </tr>
                        <tr>
                            <th className="text-left w-72 py-4 px-4 uppercase text-sm text-[#002858] font-normal">Last Name:</th>
                            <td>{member.last_name}</td>
                        </tr>
                        <tr>
                            <th className="text-left w-72 py-4 px-4 uppercase text-sm text-[#002858] font-normal">Job Title:</th>
                            <td>{member?.member?.job_title}</td>
                        </tr>
                        <tr>
                            <th className="text-left w-72 py-4 px-4 uppercase text-sm text-[#002858] font-normal">Company:</th>
                            <td>{member?.member?.company}</td>
                        </tr>
                        <tr>
                            <th className="text-left w-72 py-4 px-4 uppercase text-sm text-[#002858] font-normal">Website:</th>
                            <td>{member?.member?.website}</td>
                        </tr>
                        <tr>
                            <th className="text-left w-72 py-4 px-4 uppercase text-sm text-[#002858] font-normal">Email:</th>
                            <td>{member.email}</td>
                        </tr>
                        <tr>
                            <th className="text-left w-72 py-4 px-4 uppercase text-sm text-[#002858] font-normal">phone:</th>
                            <td>{member?.member?.phone}</td>
                        </tr>
                        <tr>
                            <th className="text-left w-72 py-4 px-4 uppercase text-sm text-[#002858] font-normal">Address:</th>
                            <td>{member?.member?.address}</td>
                        </tr>
                        <tr>
                            <th className="text-left w-72 py-4 px-4 uppercase text-sm text-[#002858] font-normal">City:</th>
                            <td>{member?.member?.city}</td>
                        </tr>
                        <tr>
                            <th className="text-left w-72 py-4 px-4 uppercase text-sm text-[#002858] font-normal">State:</th>
                            <td>{member?.member?.state}</td>
                        </tr>
                        <tr>
                            <th className="text-left w-72 py-4 px-4 uppercase text-sm text-[#002858] font-normal">Country:</th>
                            <td>{member?.member?.country}</td>
                        </tr>
                        <tr>
                            <th className="text-left w-72 py-4 px-4 uppercase text-sm text-[#002858] font-normal">Postal Code:</th>
                            <td>{member?.member?.pincode}</td>
                        </tr>
                        <tr>
                            <th className="text-left w-72 py-4 px-4 uppercase text-sm text-[#002858] font-normal">Is Active:</th>
                            <td>{(member.is_active == 1) ? 'Active' : 'In-active'}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default MemberView;
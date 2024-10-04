"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import image from "../../public/assets/images/no_image.jpg";
import toast from "react-hot-toast";
import DashboardSkeleton from "./skeleton/dashboard-skeleton";

const Dashboard = () => {
    const [loader, setLoader] = useState(true);
    const [committees, setCommittees] = useState([]);
    const [upcommingMeetings, setUpcommingMeetings] = useState([]);
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        getDashboardData().then((data) => {
            if(data.success == true)
            {
                setCommittees(data.data.committes);
                setDocuments(data.data.doclib);
                setUpcommingMeetings(data.data.events);
                setLoader(false);
            }
        }).catch((error) => {
            toast.error('unable to get issue tracker listing');
            console.log(error);
            setLoader(false);
        });
    }, [])

    const getDashboardData = async () => {
        let url = process.env.NEXT_PUBLIC_URL+"/api/dashboard";
        let response = await fetch(url, {
            method: "POST"
        })

        if(!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        if(response.ok && response.status == 200) {
            response = await response.json();
            return response;
        }
    }

    return (
        <>
            {
                (loader == true) ? <DashboardSkeleton /> :
                <div className="flex justify-between mt-6">
                    <div className="w-1/2 mr-8">
                        <div className="mb-8">
                            <h3 className="text-xl font-medium text-[#002755] mb-4">Committee Meetings:</h3>
                            <div className="border block py-8 px-6">
                                <h4 className="font-medium">No upcoming meetings to show!</h4>
                            </div>
                        </div>
                        <div className="mb-8">
                            <h3 className="text-xl font-medium text-[#002755] mb-4">Documents:</h3>
                            <div className="border block py-8 px-6">
                                <h4 className="font-medium">No document to show!</h4>
                            </div>
                        </div>
                    </div>
                    <div className="w-1/2">
                        <h3 className="text-xl font-medium text-[#002755] mb-4">Your Committees:</h3>
                        {
                            committees.map((committee, index) => (
                                <div key={index} className="flex items-center justify-between mb-8">
                                    <Image src={image} height={70} width={70} alt="image"/>
                                    <div className="ml-2">
                                        <h5 className="text-md pb-1 font-medium text-[#002755]">{committee.name}</h5>
                                        <p className="text-sm font-light">{committee.description}</p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            }
        </>
    )
}

export default Dashboard;
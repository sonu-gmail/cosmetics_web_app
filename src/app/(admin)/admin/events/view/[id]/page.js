"use client";
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import Action from '../../../../../lib/action';

const ViewEvent = ({params}) => {
    const [event, setEvent] = useState('');

    useEffect(() => {
        Action.getEventDetail(params?.id).then((data) => {
            if(data.success == true)
            {
                setEvent(data.data);
            }
        }).catch((error) => {
            toast.error('unable to get event detail');
            console.log(error);
        });
    }, [])

    const convertTo12Hour = (time) => {
        if(time != undefined) {

            // Split the time into hours and minutes
            let [hours, minutes] = time.split(':');
            
            // Convert the string values to integers
            hours = parseInt(hours);
            minutes = parseInt(minutes);
        
            // Determine AM or PM
            let period = hours >= 12 ? 'PM' : 'AM';
        
            // Convert hours to 12-hour format
            hours = hours % 12 || 12;
        
            // Format the time
            return `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${period}`;
        }
    }
    
    return (
        <>
            <div className="border-b mb-8">
                <h1 className="text-3xl text-[#002855] font-light pb-5">View Committee Meeting</h1>
            </div>
            <div className="flex justify-end text-center">
                <Link href={`/admin/events`} className="w-44 py-2 px-6 bg-primary flex items-center justify-center font-medium">Back</Link>
            </div>
            <div className="flex justify-between mt-6">
                <div className="w-full mr-8 border py-6 px-4">
                    <table className="w-full">
                        <tbody>
                            <tr>
                                <th className="text-left w-72 py-4 px-4 uppercase text-sm text-[#002858] font-normal">Title:</th>
                                <td>{event?.title}</td>
                            </tr>
                            <tr>
                                <th className="text-left w-72 py-4 px-4 uppercase text-sm text-[#002858] font-normal">Data:</th>
                                <td>{event?.date}</td>
                            </tr>
                            <tr>
                                <th className="text-left w-72 py-4 px-4 uppercase text-sm text-[#002858] font-normal">Venue:</th>
                                <td>{event?.venue}</td>
                            </tr>
                            <tr>
                                <th className="text-left w-72 py-4 px-4 uppercase text-sm text-[#002858] font-normal">Time From:</th>
                                <td>{convertTo12Hour(event?.time_from)}</td>
                            </tr>
                            <tr>
                                <th className="text-left w-72 py-4 px-4 uppercase text-sm text-[#002858] font-normal">Time To:</th>
                                <td>{convertTo12Hour(event?.time_to)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default ViewEvent;
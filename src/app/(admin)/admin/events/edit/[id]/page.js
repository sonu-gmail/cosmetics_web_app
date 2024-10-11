"use client";
import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
import Link from "next/link";
import Action from '../../../../../lib/action';
import Select from 'react-select';
import toast from 'react-hot-toast';
import { eventschema } from '../../../../../schemas/event';
import Image from 'next/image';
import { useFormik } from "formik";
import { LuLoader2 } from "react-icons/lu";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import { useRouter } from "next/navigation";
import moment from 'moment';

const CKeditor = dynamic(() => import('../../../../../../components/CKeditor'), { 
    loading: () => <Skeleton height={288} width={`100%`} />,
    ssr: false 
});

const EventEdit = ({params}) => {
    const [committees, setCommittees] = useState([]);
    const [event, setEvent] = useState('');
    const [loader, setLoader] = useState([]);
    const [isImageUpload, setIsImageUpload] = useState(false);
    const [selectedCommittees, setSelectedCommittees] = useState([]);
    const [isChecked, setIsChecked] = useState(false);
    const [editorData, setEditorData] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [timeFrom, setTimeFrom] = useState('');
    const [timeTo, setTimeTo] = useState(''); 
    const router = useRouter();

    useEffect(() => {
        let newEvenNumbers = [];
        Action.getEventDetail(params?.id).then((data) => {
            if(data.success == true)
            {
                setEvent(data.data);
                setEditorData(data.data?.discription)
                setEventDate(data.data?.date)
                setTimeFrom(data.data?.time_from)
                setTimeTo(data.data?.time_to)
                let eventCommittees = data.data?.event_committees;
                eventCommittees.forEach(committee => {
                    newEvenNumbers.push({
                        value:committee?.committee?.id,
                        label:committee?.committee?.short_name
                    })
                })
                setSelectedCommittees(newEvenNumbers);
                let checked = (data.data?.dashboard_view == 1) ? true : false;
                setIsChecked(checked)
            }
        }).catch((error) => {
            toast.error('unable to get event detail');
            console.log(error);
        });
    }, [])

    useEffect(() => {
        setFieldValue('title', event?.title);
        setFieldValue('description', event?.discription);
        setFieldValue("committees", selectedCommittees.map((option) => option.value));
        setFieldValue("dashboard_view", event?.dashboard_view);
        setFieldValue("date", event?.date);
        setFieldValue("venue", event?.venue);
        setFieldValue("time_from", event?.time_from);
        setFieldValue("time_to", event?.time_to);
    }, [event])

    useEffect(() => {
        Action.getCommitteeListing().then((data) => {
            if(data.success == true)
            {
                setCommittees(data.data);
            }
        }).catch((error) => {
            toast.error('unable to get committee listing');
            console.log(error);
        });
    }, [])

    const getFileExtension = (url) => {
        console.log(url);
        // Use URL constructor to handle complex URLs
        const pathname = new URL(url).pathname;
        // Extract the extension from the last segment of the path
        return pathname.substring(pathname.lastIndexOf('.') + 1);
    }

    const formik = useFormik({
        initialValues:{
            title:"",
            description:"",
            date:"",
            venue:"",
            time_from:"",
            time_to:"",
            thumb:"",
            dashboard_view:"", 
            committees:[]
        },
	    validationSchema: eventschema,
	    onSubmit: async (values) => {
            setLoader(true)
            const f = new FormData();
            f.append('event_id', event?.id);
            f.append('title', values.title);
            f.append('date', moment(values.date).format('YYYY-MM-DD'));
            f.append('venue', values.venue);
            f.append('time_from', values.time_from);
            f.append('time_to', values.time_to);
            f.append('description', values.description);
			f.append('dashboard_view', values.dashboard_view);
            values.committees.forEach((item) => f.append("committees[]", item))
            if(isImageUpload) {
                f.append('thumb', values.thumb);
            }
            Action.updateEvent(f).then((data) => {
                if(data.success == true)
                {
                    console.log(data);
                    setLoader(false);
                    toast.success(data.message);
                    router.push('/admin/events');

                }
                if(data.error == true)
                {
                    console.log(data);
                    setLoader(false);
                    toast.success(data.message);

                }
            }).catch((error) => {
                toast.error('unable to update event');
                console.log(error);
                setLoader(false);
            });
		},
	});
    const { errors, touched, setFieldValue, handleChange, handleSubmit } = formik;

    const handleImageUpload = (e) => {
		formik.setFieldValue('thumb', e.currentTarget.files[0]);
        setIsImageUpload(true);
	}

    const handleCommitte = (option) => {
        setSelectedCommittees(option);
    }

    return (
        <>
            <div className="border-b mb-8">
                <h1 className="text-3xl text-[#002855] font-light pb-5">Edit Committee Meeting</h1>
            </div>
            <div className="flex justify-end text-center">
                <Link href={`/admin/events`} className="w-44 py-2 px-6 bg-primary flex items-center justify-center font-medium">Back</Link>
            </div>
            <div className="flex justify-between mt-6">
                <div className="w-1/2 mr-8 border py-6 px-4">
                <form method="POST" onSubmit={handleSubmit} encType="multipart/form-data">
                        <label className="block mb-4 mr-2">
                            <span className="block text-sm font-normal mb-3 text-[#002855]">Title:<sup className='text-red-700'>*</sup></span>
                            <input
                                type="text" 
                                name="title"
                                onChange={handleChange}
                                defaultValue={event?.title}
                                className="mt-1 h-11 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none"
                            />
                            {errors?.title && touched?.title && <span className="text-sm text-[red]">{errors?.title}</span>}
                        </label>
                        <div className="flex justify-between">
                            <label className="block mb-4 w-1/2 mr-2">
                                <span className="block text-sm font-normal mb-3 text-[#002855]">Date<sup className='text-red-700'>*</sup></span>
                                <DatePicker 
                                    dateFormat="YYYY-MM-dd"
                                    onChange={(date) => {
                                        setEventDate(date)
                                        setFieldValue('date', new Date(date).toLocaleDateString("en-US"))
                                    }} 
                                    minDate={new Date()}
                                    selected={eventDate}
                                    className="w-full h-[38px] border outline-none"
                                    name="externalDeadline"
                                />
                                {errors?.date && touched?.date && <span className="text-sm text-[red]">{errors?.date}</span>}
                            </label>
                            <label className="block mb-4 w-1/2 ml-2">
                                <span className="block text-sm font-normal mb-3 text-[#002855]">Venue<sup className='text-red-700'>*</sup></span>
                                <input 
                                    type="text"
                                    name="venue"
                                    defaultValue={event?.venue}
                                    onChange={handleChange}
                                    className="mt-1 h-11 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none"
                                />
                                {errors?.venue && touched?.venue && <span className="text-sm text-[red]">{errors?.venue}</span>}
                            </label>
                        </div>
                        <label className="block mb-4 mr-2">
                            <span className="block text-sm font-normal mb-3 text-[#002855]">Time:<sup className='text-red-700'>*</sup></span>
                        </label>
                        <div className="flex justify-between">
                            <label className="block mb-4 w-1/2 mr-2">
                                <TimePicker 
                                    value={timeFrom} 
                                    format='hh:mm a'
                                    minDetail='hour'
                                    selected={timeFrom}
                                    maxDetail='hour'
                                    clearIcon={false}
                                    onChange={(value) => {
                                        setTimeFrom(value)
                                        setFieldValue('time_from', value)
                                    }} 
                                    className="mt-1 h-11 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none"
                                />  
                                {errors?.time_from && touched?.time_from && <span className="text-sm text-[red]">{errors?.time_from}</span>}
                            </label>
                            <label className="block mb-4 w-1/2 ml-2">
                                <TimePicker 
                                    value={timeTo} 
                                    format='hh:mm a'
                                    minDetail='hour'
                                    maxDetail='hour'
                                    selected={timeTo}
                                    clearIcon={false}
                                    onChange={(value) => {
                                        setTimeTo(value)
                                        setFieldValue('time_to', value)
                                    }} 
                                    className="mt-1 h-11 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none"
                                />
                                {errors?.time_to && touched?.time_to && <span className="text-sm text-[red]">{errors?.time_to}</span>}
                            </label>
                        </div>
                        <label className="block mb-4 mr-2">
                            <span className="block text-sm font-normal mb-3 text-[#002855]">Description:<sup className='text-red-700'>*</sup></span>
                            <div>
                                <CKeditor
                                    name="description"
                                    data={editorData}
                                    onChange={(data) => {setFieldValue("description", data);}}
                                />
                                {errors?.description && touched?.description && <span className="text-sm text-[red]">{errors?.description}</span>}
                            </div>
                        </label>
                        <label className="block mb-4 w-full">
                            <span className="block text-sm font-normal mb-3 text-[#002855]">FIle</span>
                            <input 
                                type="file"
                                className="mt-1 h-11 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none"
                                onChange={(e) => handleImageUpload(e)}
                            />
                            {
                                (event != '') ? <>
                                    <Link href={event?.file} target='_blank'>
                                        <div className='mt-2 mb-2'>
                                            <Image src={`/assets/images/icons/${getFileExtension(event?.file)}.png`} height={100} width={100} alt="icon"/>
                                        </div>
                                    </Link>
                                </>:''
                            }
                            {errors?.thumb && touched?.thumb && <span className="text-sm text-[red]">{errors?.thumb}</span>}
                        </label>
                        <label className="block mb-4 mr-2">
                            <span className="block text-sm font-normal mb-3 text-[#002855]">Committees:<sup className='text-red-700'>*</sup></span>
                            <Select
                                instanceId="committees"
                                className="basic-single"
                                classNamePrefix="select"
                                isSearchable={true}
                                isMulti
                                name="committees"
                                placeholder="Please select committees"
                                options={committees}
                                value={selectedCommittees}
                                onChange={(selectedOption) => { 
                                    console.log(selectedOption);
                                    setFieldValue("committees", selectedOption.map((option) => option.value)); 
                                    handleCommitte(selectedOption);
                                }}
                            />
                            {errors?.committees && touched?.committees && <span className="text-sm text-[red]">{errors?.committees}</span>}
                        </label>
                        <label className="block mb-4 mr-2 mt-2">
                            <input 
                                type="checkbox" 
                                className="" 
                                name='dashboard_view' 
                                checked={isChecked} 
                                onChange={handleChange}
                            /><span className="text-base font-medium text-[#646464] ml-2 mb-6">Show on Dashboard</span> 
                        </label>
                        {
                            (loader == true) ? <button type="submit" className="flex items-center justify-center bg-primary mt-4 px-16 py-2 rounded text-white w-[220px]"><LuLoader2 size={20} className="loading-icon"/></button> : <button type='submit' className="bg-primary py-2 px-8 text-sm text-[#002855] font-medium mt-4">Update</button>
                        }
                    </form>
                </div>
            </div>
        </>
    )
}

export default EventEdit;
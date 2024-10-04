"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Select from 'react-select';
import Action from "../../../../../lib/action";
import { memberchema } from "../../../../../schemas/member";
import toast from 'react-hot-toast';
import { useFormik } from "formik";
import { LuLoader2 } from "react-icons/lu";
import { useRouter } from "next/navigation";

const MemberEdit = ({params}) => {

    const router = useRouter();
    const [member, setMember] = useState('');
    const [loader, setLoader] = useState(false);
    const [committees, setCommittees] = useState([]);
    const [selectedCommittees, setSelectedCommittees] = useState([]);
    const[isImageUpload, setIsImageUpload] = useState(false);

    useEffect(() => {
        let newEvenNumbers = [];
        Action.getMemberDetail(params.id).then((data) => {
            if(data.success == true)
            {
                setMember(data.data);
                let memberCommittee = data.data?.member?.member_committees;
                memberCommittee.forEach(committee => {
                    newEvenNumbers.push({
                        value:committee?.committee?.id,
                        label:committee?.committee?.short_name
                    })
                })
                setSelectedCommittees(newEvenNumbers);
            }
        }).catch((error) => {
            toast.error('unable to get member Detail');
            console.log(error);
        });
    },[])

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

    useEffect(() => {
        setFieldValue('first_name', member?.first_name);
        setFieldValue('last_name', member?.last_name);
        setFieldValue('job_title', member?.member?.job_title);
        setFieldValue('email', member?.email);
        setFieldValue('company', member?.member?.company);
        setFieldValue('phone', member?.member?.phone);
        setFieldValue('website', member?.member?.website);
        setFieldValue('address', member?.member?.address);
        setFieldValue('city', member?.member?.city);
        setFieldValue('state', member?.member?.state);
        setFieldValue('country', member?.member?.country);
        setFieldValue('pincode', member?.member?.pincode);
        setFieldValue("committees", selectedCommittees.map((option) => option.value)); 

    },[member])

    const formik = useFormik({
        initialValues:{
            first_name:"",
            last_name:"",
            email:"", 
            job_title:"",
            email:"",
            phone:"",
            company:"",
            website:"",
            address:"",
            city:"",
            state:"",
            country:"",
            pincode:"",
            image:"",
            is_active:"1", 
            committees:[]
        },
	    validationSchema: memberchema,
	    onSubmit: async (values) => {
            setLoader(true)
            const f = new FormData();
            f.append('id', member?.member.id);
            f.append('user_id', member?.member?.user_id);
            f.append('first_name', values.first_name);
            f.append('last_name', values.last_name);
			f.append('email', values.email);
			f.append('job_title', values.job_title);
			f.append('company', values.company);
			f.append('phone', values.phone);
			f.append('city', values.city);
			f.append('state', values.state);
			f.append('country', values.country);
			f.append('pincode', values.pincode);
			f.append('website', values.website);
			f.append('address', values.address);
			f.append('is_active', values.is_active);
            values.committees.forEach((item) => f.append("committees[]", item))
            if(isImageUpload) {
                f.append('image', values.image);
            }
            Action.updateMember(f).then((data) => {
                if(data.success == true)
                {
                    console.log(data);
                    setLoader(false);
                    toast.success(data.message);
                    router.push('/admin/member/listing');

                }
            }).catch((error) => {
                toast.error('unable to update Member');
                console.log(error);
                setLoader(false);
            });
		},
	});
	const { errors, touched, setFieldValue, handleChange, handleSubmit } = formik;

    const handleImageUpload = (e) => {
		formik.setFieldValue('image', e.currentTarget.files[0]);
        setIsImageUpload(true);
	}

    const handleCommitte = (option) => {
        setSelectedCommittees(option);
    }


    return (
        <>
            <div className="border-b mb-8">
                <h1 className="text-3xl text-[#002855] font-light pb-5"> Edit Member</h1>
            </div>
            <div className="flex justify-end text-center">
                <Link href={`/admin/member/listing`} className="w-44 py-2 px-6 bg-primary flex items-center justify-center font-medium">Back</Link>
            </div>
            <div className="border w-1/2 py-7 px-7">
                <form onSubmit={handleSubmit} method="POST" encType="multipart/form-data">
                    <div className="flex justify-between">
                        <label className="block mb-4 w-1/2 mr-2">
                            <span className="block text-sm font-normal mb-3 text-[#002855]">First Name<sup className="text-red-700">*</sup></span>
                            <input 
                                type="text" 
                                name="first_name"
                                defaultValue={member.first_name}
                                onChange={handleChange}
                                className="mt-1 h-11 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none"
                            />
                            {errors?.first_name && touched?.first_name && <span className="text-sm text-[red]">{errors?.first_name}</span>}
                        </label>
                        <label className="block mb-4 w-1/2 ml-2">
                            <span className="block text-sm font-normal mb-3 text-[#002855]">Last Name<sup className="text-red-700">*</sup></span>
                            <input 
                                type="text" 
                                name="last_name"
                                defaultValue={member.last_name}
                                onChange={handleChange}
                                className="mt-1 h-11 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none"
                            />
                            {errors?.last_name && touched?.last_name && <span className="text-sm text-[red]">{errors?.last_name}</span>}
                        </label>
                    </div>
                    <label className="block mb-4">
                        <span className="block text-sm font-normal mb-3 text-[#002855]">Job Title<sup className="text-red-700">*</sup></span>
                        <input 
                            type="text" 
                            name="job_title"
                            defaultValue={member?.member?.job_title}
                            onChange={handleChange}
                            className="mt-1 h-11 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none"
                        />
                        {errors?.job_title && touched?.job_title && <span className="text-sm text-[red]">{errors?.job_title}</span>}

                    </label>
                    <label className="block mb-4">
                        <span className="block text-sm font-normal mb-3 text-[#002855]">Email<sup className="text-red-700">*</sup></span>
                        <input 
                            type="text" 
                            name="email"
                            defaultValue={member.email}
                            onChange={handleChange}
                            className="mt-1 h-11 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none"
                        />
                        {errors?.email && touched?.email && <span className="text-sm text-[red]">{errors?.email}</span>}
                    </label>
                    <label className="block mb-4">
                        <span className="block text-sm font-normal mb-3 text-[#002855]">Phone Number</span>
                        <input 
                            type="text" 
                            name="phone"
                            onChange={handleChange} 
                            defaultValue={member?.member?.phone}
                            className="mt-1 h-11 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none"
                        />
                    </label>
                    <div className="flex justify-between">
                        <label className="block mb-4 w-1/2 mr-2">
                            <span className="block text-sm font-normal mb-3 text-[#002855]">Company<sup className="text-red-700">*</sup></span>
                            <input 
                                type="text"
                                name="company"
                                defaultValue={member?.member?.company}
                                onChange={handleChange}  
                                className="mt-1 h-11 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none"
                            />
                            {errors?.company && touched?.company && <span className="text-sm text-[red]">{errors?.company}</span>}
                        </label>
                        <label className="block mb-4 w-1/2 ml-2">
                            <span className="block text-sm font-normal mb-3 text-[#002855]">Website</span>
                            <input 
                                type="text"
                                name="website"
                                defaultValue={member?.member?.website}
                                onChange={handleChange}  
                                className="mt-1 h-11 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none"
                            />
                        </label>
                    </div>
                    <label className="block mb-4">
                        <span className="block text-sm font-normal mb-3 text-[#002855]">Address</span>
                        <input 
                            type="text" 
                            name="address"
                            defaultValue={member?.member?.address}
                            onChange={handleChange} 
                            className="mt-1 h-11 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none"
                        />
                    </label>
                    <div className="flex justify-between">
                        <label className="block mb-4 w-1/2 mr-2">
                            <span className="block text-sm font-normal mb-3 text-[#002855]">City</span>
                            <input 
                                type="text"
                                name="city"
                                defaultValue={member?.member?.city}
                                onChange={handleChange}  
                                className="mt-1 h-11 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none"
                            />
                        </label>
                        <label className="block mb-4 w-1/2 ml-2">
                            <span className="block text-sm font-normal mb-3 text-[#002855]">Province</span>
                            <input 
                                type="text"
                                name="state"
                                defaultValue={member?.member?.state}
                                onChange={handleChange} 
                                className="mt-1 h-11 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none"
                            />
                        </label>
                    </div>
                    <div className="flex justify-between">
                        <label className="block mb-4 w-1/2 mr-2">
                            <span className="block text-sm font-normal mb-3 text-[#002855]">Country</span>
                            <input 
                                type="text"
                                name="country"
                                defaultValue={member?.member?.country}
                                onChange={handleChange}  
                                className="mt-1 h-11 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none"
                            />
                        </label>
                        <label className="block mb-4 w-1/2 ml-2">
                            <span className="block text-sm font-normal mb-3 text-[#002855]">Postal Code</span>
                            <input 
                                type="text"
                                name="pincode"
                                defaultValue={member?.member?.pincode}
                                onChange={handleChange}  
                                className="mt-1 h-11 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none"
                            />
                        </label>
                    </div>
                    <label className="block mb-4">
                        <span className="block text-sm font-normal mb-3 text-[#002855]">Committee<sup className="text-red-700">*</sup></span>
                        <Select
                            instanceId="committees"
                            className="basic-single"
                            classNamePrefix="select"
                            isSearchable={true}
                            isMulti
                            name="committees"
                            value={selectedCommittees}
                            options={committees}
                            placeholder="Please select committees"
                            onChange={(selectedOption) => { 
                                setFieldValue("committees", selectedOption.map((option) => option.value)); 
                                handleCommitte(selectedOption);
                            }}
                        />
                        {errors?.committees && touched?.committees && <span className="text-sm text-[red]">{errors?.committees}</span>}

                    </label>
                    <label className="block mb-4 w-full ml-2">
                        <span className="block text-sm font-normal mb-3 text-[#002855]">Image</span>
                        <input 
                            type="file"
                            className="mt-1 h-11 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none"
                            onChange={(e) => handleImageUpload(e)}
                        />
                    </label>
                    {
                        (loader == true) ? <button type="submit" className="flex items-center justify-center bg-primary mt-4 px-16 py-2 rounded text-white w-[220px]"><LuLoader2 size={20} className="loading-icon"/></button> : <button type='submit' className="bg-primary py-2 px-8 text-sm text-[#002855] font-medium mt-4">Update</button>
                    }
                </form>
            </div>
        </>
    );
}

export default MemberEdit;
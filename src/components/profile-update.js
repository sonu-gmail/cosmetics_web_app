"use client"
import { useState, useEffect } from "react";
import Image from "next/image";
import ProfileImg from "../../public/assets/images/no_image.jpg";
import Select from 'react-select';
import Action from "../app/lib/action";
import { profileschema } from "../app/schemas/profile";
import toast from 'react-hot-toast';
import { useFormik } from "formik";
import { LuLoader2 } from "react-icons/lu";
import { useRouter } from "next/navigation";

const ProfileUpdate = () => {
    const [loader, setLoader] = useState(false);
    const [profile, setProfile] = useState('');
    const[isImageUpload, setIsImageUpload] = useState(false);
    const router = useRouter();

    useEffect(() => {
        Action.getProfile().then((data) => {
            if(data.success == true)
            {
                setProfile(data.data);
            }
        }).catch((error) => {
            toast.error('unable to get committee listing');
            console.log(error);
        });
    },[])

    const handleImageUpload = (e) => {
		formik.setFieldValue('image', e.currentTarget.files[0]);
        setIsImageUpload(true);
	}

    useEffect(() => {
        setFieldValue('first_name', profile?.first_name);
        setFieldValue('last_name', profile?.last_name);
        setFieldValue('job_title', profile?.member?.job_title);
        setFieldValue('email', profile?.email);
        setFieldValue('company', profile?.member?.company);
        setFieldValue('phone', profile?.member?.phone);
        setFieldValue('website', profile?.member?.website);
        setFieldValue('address', profile?.member?.address);
        setFieldValue('city', profile?.member?.city);
        setFieldValue('state', profile?.member?.state);
        setFieldValue('country', profile?.member?.country);
        setFieldValue('pincode', profile?.member?.pincode);
    },[profile])

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
        },
	    validationSchema: profileschema,
	    onSubmit: async (values) => {
            console.log(values);
            setLoader(true)
            const f = new FormData();
            f.append('user_id', profile?.id);
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
            if(isImageUpload) {
                f.append('image', values.image);
            }
            Action.updateProfile(f).then((data) => {
                if(data.success == true)
                {
                    console.log(data);
                    setLoader(false);
                    toast.success(data.message);
                    router.push('/admin/profile/update');

                }
            }).catch((error) => {
                toast.error('unable to update profile');
                console.log(error);
                setLoader(false);
            });
		},
	});
	const { errors, touched, setFieldValue, handleChange, handleSubmit } = formik;
    return (
        <>
            <div className="border w-1/2 py-7 px-7">
                <form onSubmit={handleSubmit} method="POST" encType="multipart/form-data">
                    <div className="flex justify-between">
                        <label className="block mb-4 w-1/2 mr-2">
                            <span className="block text-sm font-normal mb-3 text-[#002855]">First Name <sup className="text-red-600">*</sup></span>
                            <input 
                                type="text"
                                name="first_name"
                                defaultValue={profile?.first_name}
                                onChange={handleChange} 
                                className="mt-1 h-11 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none"
                            />
                            {errors?.first_name && touched?.first_name && <span className="text-sm text-[red]">{errors?.first_name}</span>}
                        </label>
                        <label className="block mb-4 w-1/2 ml-2">
                            <span className="block text-sm font-normal mb-3 text-[#002855]">Last Name<sup className="text-red-600">*</sup></span>
                            <input 
                                type="text"
                                name="last_name"
                                defaultValue={profile?.last_name}
                                onChange={handleChange} 
                                className="mt-1 h-11 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none"
                            />
                            {errors?.last_name && touched?.last_name && <span className="text-sm text-[red]">{errors?.last_name}</span>}
                        </label>
                    </div>
                    <label className="block mb-4">
                        <span className="block text-sm font-normal mb-3 text-[#002855]">Job Title<sup className="text-red-600">*</sup></span>
                        <input 
                            type="text" 
                            name="job_title"
                            defaultValue={profile?.member?.job_title}
                            onChange={handleChange}
                            className="mt-1 h-11 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none"
                        />
                        {errors?.job_title && touched?.job_title && <span className="text-sm text-[red]">{errors?.job_title}</span>}

                    </label>
                    <label className="block mb-4">
                        <span className="block text-sm font-normal mb-3 text-[#002855]">Email<sup className="text-red-600">*</sup></span>
                        <input 
                            type="text" 
                            name="email"
                            defaultValue={profile?.email}
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
                            defaultValue={profile?.member?.phone}
                            onChange={handleChange}
                            className="mt-1 h-11 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none"
                        />
                    </label>
                    <div className="flex justify-between">
                        <label className="block mb-4 w-1/2 mr-2">
                            <span className="block text-sm font-normal mb-3 text-[#002855]">Company<sup className="text-red-600">*</sup></span>
                            <input 
                                type="text" 
                                name="company"
                                defaultValue={profile?.member?.company}
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
                                defaultValue={profile?.member?.website}
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
                            defaultValue={profile?.member?.address}
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
                                defaultValue={profile?.member?.city}
                                onChange={handleChange}
                                className="mt-1 h-11 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none"
                            />
                        </label>
                        <label className="block mb-4 w-1/2 ml-2">
                            <span className="block text-sm font-normal mb-3 text-[#002855]">Province</span>
                            <input 
                                type="text" 
                                name="state"
                                defaultValue={profile?.member?.state}
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
                                defaultValue={profile?.member?.country}
                                onChange={handleChange}
                                className="mt-1 h-11 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none"
                            />
                        </label>
                        <label className="block mb-4 w-1/2 ml-2">
                            <span className="block text-sm font-normal mb-3 text-[#002855]">Postal Code</span>
                            <input 
                                type="text" 
                                name="pincode"
                                defaultValue={profile?.member?.pincode}
                                onChange={handleChange}
                                className="mt-1 h-11 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none"
                            />
                        </label>
                    </div>
                    <label className="block mb-4 w-full ml-2">
                        <span className="block text-sm font-normal mb-3 text-[#002855]">Image</span>
                        <input 
                            type="file" 
                            onChange={(e) => handleImageUpload(e)}
                            className="mt-1 h-11 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none"
                        />
                        {errors?.image && touched?.image && <span className="text-sm text-[red]">{errors?.image}</span>}

                    </label>
                    <Image src={ProfileImg}  width={100} height={100} alt="profile-image"/>
                    {
                        (loader == true) ? <button type="submit" className="flex items-center justify-center bg-primary mt-4 px-16 py-2 rounded text-white w-[220px]"><LuLoader2 size={20} className="loading-icon"/></button> : <button type='submit' className="bg-primary py-2 px-8 text-sm text-[#002855] font-medium mt-4">Update</button>
                    }
                </form>
            </div>
        </>
    )
}

export default ProfileUpdate;
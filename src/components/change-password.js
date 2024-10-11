"use client"
import { useState, useEffect } from "react";
import Action from "../app/lib/action";
import toast from 'react-hot-toast';
import { changepasswordschema } from "../app/schemas/changepassword";
import { useFormik } from "formik";
import { LuLoader2 } from "react-icons/lu";
import { useRouter } from "next/navigation";

const PasswordChange = () => {
    const [loader, setLoader] = useState(false);
    const router = useRouter();
    const formik = useFormik({
        initialValues:{
            'password':"",
            'new_password':"",
            'new_password_confirmation':"", 
        },
        validationSchema:changepasswordschema,
        onSubmit: async (values) => {
            console.log(values);
            setLoader(true)
            const f = new FormData();
            f.append('password', values.password);
            f.append('new-password', values.new_password);
            f.append('new-password_confirmation', values.new_password_confirmation);
            Action.changePassword(f).then((data) => {
                if(data.success == true)
                {
                    console.log(data);
                    setLoader(false);
                    toast.success(data.message);
                    router.push('/admin');

                }

                if(data.error == true)
                {
                    toast.error(data.message);
                    setLoader(false);

                }
            }).catch((error) => {
                toast.error('unable to update password');
                console.log(error);
                setLoader(false);
            });
		},
	});
	const { errors, touched, handleChange, handleSubmit, resetForm } = formik;

    return (
        <>
            <div className="border w-1/2 py-7 px-7">
                <form onSubmit={handleSubmit} method="POST">
                    <label className="block mb-4">
                        <span className="block text-sm font-normal mb-3 text-[#002855]">Current Password</span>
                        <input 
                            type="password" 
                            name="password"
                            onChange={handleChange}
                            className="mt-1 h-11 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none"
                        />
                        {errors?.password && touched?.password && <span className="text-sm text-[red]">{errors?.password}</span>}
                    </label>
                    <label className="block mb-4">
                        <span className="block text-sm font-normal mb-3 text-[#002855]">New Password</span>
                        <input 
                            type="password" 
                            name="new_password"
                            onChange={handleChange}
                            className="mt-1 h-11 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none"
                        />
                        {errors?.new_password && touched?.new_password && <span className="text-sm text-[red]">{errors?.new_password}</span>}
                    </label>
                    <label className="block mb-4">
                        <span className="block text-sm font-normal mb-3 text-[#002855]">Confirm New Password</span>
                        <input 
                            type="password"
                            name="new_password_confirmation"
                            onChange={handleChange}
                            className="mt-1 h-11 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none"
                        />
                        {errors?.new_password_confirmation && touched?.new_password_confirmation && <span className="text-sm text-[red]">{errors?.new_password_confirmation}</span>}
                    </label>
                    {
                        (loader == true) ? <button type="submit" className="flex items-center justify-center bg-primary mt-4 px-16 py-2 rounded text-white w-[220px]"><LuLoader2 size={20} className="loading-icon"/></button> : <button type='submit' className="bg-primary py-2 px-8 text-sm text-[#002855] font-medium mt-4">Update Password</button>
                    }
                </form>
            </div>
        </>
    )
}

export default PasswordChange;
"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { FaSignInAlt } from "react-icons/fa";
import { loginschema } from "../app/schemas/login";
import { LuLoader2 } from "react-icons/lu";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";

const LoginForm = () => {

    const [loader, setLoader] = useState(false);
    const router = useRouter();

    const formik = useFormik({
		initialValues: {email: "",password:""},
	    validationSchema: loginschema,
	    // Handle form submission
		onSubmit: async (values) => {
			setLoader(true);
            const res = await signIn('credentials', {
				email: values.email,
				password: values.password,
				redirect:false
			});
			if(!res.ok) {
				toast.error('Invalid Credentials.');
				setLoader(false);
			}

			if(res.ok) {
				toast.success('User logged in successfully!');
				setLoader(false);
                router.push('/admin');
			}
		},
	});

	const { errors, touched, values, handleChange, handleSubmit } = formik;

    return (
        <form onSubmit={handleSubmit} method="POST">
            <div className="mb-6">
                <input 
                    type="text"
                    name="email" 
                    placeholder="Email" 
                    className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-200 rounded focus:outline-none"
                    onChange={handleChange}
                    value={values?.email}
                />
                {errors?.email && touched?.email && <span className="text-sm text-[red]">{errors?.email}</span>} 
            </div>
            <div className="mb-6">
                <input
                    type="password"
                    name="password" 
                    placeholder="Password"
                    className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-200 rounded focus:outline-none" 
                    onChange={handleChange}
                    value={values?.password}
                />
                {errors?.password && touched?.password && <span className="text-sm text-[red]">{errors?.password}</span>}
            </div> 
            <input type="checkbox" className="" /><span className="text-base font-light text-[#646464] ml-2 mb-6">Remember Me</span> 
            {
                (loader == true) ? <button type="submit" className="flex items-center justify-center bg-primary mt-4 px-16 py-2 rounded text-white w-[220px]"><LuLoader2 size={20} className="loading-icon"/></button> : <button type="submit" className="flex items-center bg-primary mt-4 px-16 py-2 rounded text-white w-[220px]"><FaSignInAlt  className="mr-2"/> Sign In</button>
            }
        </form>
    );
}

export default LoginForm;
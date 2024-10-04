"use client"
import { useState } from "react";
import profileImg from "../../../public/assets/images/no_image.jpg"
import Link from "next/link";
import { FaCaretDown } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { signOut } from "next-auth/react";
import { MdLogout, MdKey } from "react-icons/md";
import Image from "next/image";
import { FaBars } from "react-icons/fa6";
import toast from "react-hot-toast";
import { useSession } from 'next-auth/react';
import loginService from "../../app/services/login";

const Header = ({sidebar, isOpenSidebar}) => {

    const [isOpen, setIsOpen] = useState(false);
    const {data} = useSession();

    
    const handleMyAccountDropDown = () => {
        setIsOpen(!isOpen)
    }

    const handleSidebar = () => {
        sidebar(!isOpenSidebar)
    }

    const handleLogout = async () => {
        if(data?.accessToken) {
            let response = await loginService.logout(data?.accessToken);
            if (!response.ok) {
				toast.error('Unable to logout.');
			}
	  
			const res = await response.json();
			if(res.success == true) {
				signOut({ callbackUrl: '/login', redirect:true });
				toast.success('User logout successfully');
			}
        }
    }

    return (
        <div className="relative shadow-md bg-white flex-shrink-0">
            <div className="flex justify-between items-center h-16 px-12">
                <div className="relative">
                    <div className="flex items-center">
                        <FaBars size={25} onClick={handleSidebar}/>
                        <h1 className="ml-2 text-2xl font-medium text-[#2c9ba2]">Cosmetics Alliance Committee Portal</h1>
                    </div>
                </div>
                <div className="flex items-center">
                    <div className="ml-6">
                        <div className="relative w-48">
                            <button type="button" className="block w-full focus:outline-none" onClick={handleMyAccountDropDown}>
                                <span className="flex items-center justify-end">
                                <Image src={profileImg} width={50} height={50} alt="profile-img" className="h-8 w-8 rounded-full"/>
                                <span className="ml-3">My Account</span>
                                <FaCaretDown />
                                </span>
                            </button>
                            <ul className={`${(isOpen == true) ? '' : 'hidden'} absolute z-10 w-56 mt-4 rounded-md border border-blue-gray-50 bg-white p-3 font-sans text-sm font-normal text-blue-gray-500 shadow-lg shadow-blue-gray-500/10 focus:outline-none`}>
                                <li className="block w-full cursor-pointer select-none rounded-md px-3 pt-[9px] pb-2 text-start leading-tight transition-all hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900">
                                    <Link href="/admin/profile/update" onClick={() =>setIsOpen(false)} className="flex items-center"><CgProfile size={18} className="mr-2"/>Manage Your Profile</Link>
                                </li>
                                <li className="block w-full cursor-pointer select-none rounded-md px-3 pt-[9px] pb-2 text-start leading-tight transition-all hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900">
                                    <Link href="/admin/password/change" onClick={() =>setIsOpen(false)} className="flex items-center"><MdKey size={18} className="mr-2"/>Change Password</Link>
                                </li>
                                <li className="block w-full cursor-pointer select-none rounded-md px-3 pt-[9px] pb-2 text-start leading-tight transition-all hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900">
                                    <Link href="" className="flex items-center" onClick={handleLogout}><MdLogout size={18} className="mr-2"/>Logout</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;
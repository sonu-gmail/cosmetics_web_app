"use client"
import { useState, useEffect } from "react";
import Link from "next/link"
import Image from "next/image"
import logo from "../../../public/assets/logo/logo.png"
import { AiOutlineDashboard } from "react-icons/ai";
import { FaCaretRight, FaCaretDown } from "react-icons/fa";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";

const Sidebar = ({isOpenSidebar}) => {

    const [issueTracker, setIssueTracker] = useState(false);
    const [issueTrackerListing, setIssueTrackerListing] = useState([]);
    const [archivedMenu, setArchivedMenu] = useState(false);
    const pathName = usePathname();

    const handleMenu = (value) => {
        
        if(value == "issueTracker") {
            setIssueTracker(!issueTracker)
            if(archivedMenu == true) {
                setArchivedMenu(false)
            }
        }

        if(value == "archived") {
            setArchivedMenu(!archivedMenu)
            if(issueTracker == true) {
                setIssueTracker(false)
            }
        } 
    }

    useEffect(() => {
        getIssueTrackerListing().then((data) => {
            if(data.success == true)
            {
                setIssueTrackerListing(data.data)
            }
        }).catch((error) => {
            toast.error('unable to get issue tracker listing');
            console.log(error);
        });
    },[]);
    
    const getIssueTrackerListing = async () => {
        let url = process.env.NEXT_PUBLIC_URL+"/api/issue/listing";
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
            <div className={`flex-shrink-0 w-72 bg-primary-blue ${(isOpenSidebar == true) ? '' : 'hidden'}`}>
                <Link href="/admin">
                    <div className="flex items-center justify-center py-8">
                        <Image src={logo} alt="logo" priority={true}/>
                    </div>
                </Link>
                <p className="text-center text-white text-2xl">Committee Portal</p>
                <div className="py-7">
                    <ul>
                        <li className="text-white py-3 px-3">
                            <Link href="/admin" className="flex items-center">
                                <AiOutlineDashboard className="mr-2" size={25}/> Dashboard
                            </Link>
                        </li>
                        <li onClick={() => handleMenu('issueTracker')}>
                            <Link href="#" className={`flex items-center justify-between ${(issueTracker == false) ? 'text-[#44b4a6]' : 'text-white'} py-3 px-3 uppercase text-base hover:text-opacity-45 hover:bg-[#002044]`}>Issue Tracker {(issueTracker == false) ? <FaCaretRight /> : <FaCaretDown />}</Link>
                            <ul className={ (issueTracker == false && pathName.includes('/admin/issue') == false) ? 'hidden' : ''}>
                                {
                                    issueTrackerListing.map((issueTracker, index) => (
                                        <li key={index} className={`text-white py-2 px-3 uppercase text-xs hover:text-opacity-45 hover:bg-[#002044] ${pathName.includes('/admin/issue/'+issueTracker?.id) ? 'bg-[#002044]' : ''}`}>
                                            <Link href={`/admin/issue/${issueTracker.id}`} className="flex items-center"><FaCaretRight/>{issueTracker.name}</Link>
                                        </li>
                                    ))
                                }
                            </ul>
                        </li>
                        <li className={`text-[#44b4a6] py-3 px-3 uppercase text-base hover:text-opacity-45 hover:bg-[#002044] ${pathName.includes('/admin/member') ? 'bg-[#002044]' : ''}`}>
                            <Link href="/admin/member/listing">Members</Link>
                        </li>
                        <li className={`text-[#44b4a6] py-3 px-3 uppercase text-base hover:text-opacity-45 hover:bg-[#002044] ${pathName.includes('/admin/document') ? 'bg-[#002044]' : ''}`}>
                            <Link href="/admin/document">Documents</Link>
                        </li>
                        <li className={`text-[#44b4a6] py-3 px-3 uppercase text-base hover:text-opacity-45 hover:bg-[#002044] ${pathName.includes('/admin/events') ? 'bg-[#002044]' : ''}`}>
                            <Link href="/admin/events">Commitee Meetings</Link>
                        </li>
                        <li  onClick={() => handleMenu('archived')}>
                            <Link href="/admin" className={`flex items-center justify-between ${(archivedMenu == false) ? 'text-[#44b4a6]' : 'text-white'} py-3 px-3 uppercase text-base hover:text-opacity-45 hover:bg-[#002044]`}>Archived {(archivedMenu == false) ? <FaCaretRight /> : <FaCaretDown />}</Link>
                            <ul className={ (archivedMenu == false && pathName.includes('/admin/archived') == false) ? 'hidden' : ''}>
                                <li className={`text-white py-2 px-3 uppercase text-xs hover:text-opacity-45 hover:bg-[#002044] ${pathName.includes('/admin/archived/issues') ? 'bg-[#002044]' : ''}`}>
                                    <Link href="/admin/archived/issues" className="flex items-center"><FaCaretRight/>Issue Tracker</Link>
                                </li>
                                <li className={`text-white py-2 px-3 uppercase text-xs hover:text-opacity-45 hover:bg-[#002044] ${pathName.includes('/admin/archived/documents') ? 'bg-[#002044]' : ''}`}>
                                    <Link href="/admin/archived/documents" className="flex items-center"><FaCaretRight/>Documents</Link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}

export default Sidebar;

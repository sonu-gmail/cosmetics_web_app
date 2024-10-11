"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Moment from 'react-moment';
import { FaPlus } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { GrPowerReset } from "react-icons/gr";
import Action from "../../../lib/action";
import toast from "react-hot-toast";
import DocumentSkeleton from "../../../../components/skeleton/document-skeleton";
import Pagination from "../../../../components/Pagination";
import useDebounce from "../../../hooks/useDebounce";

const EventLiting = () => {
    const [loader, setLoader] = useState(true);
    const [events, setEvents] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [sorting, setSorting] = useState('');
    const [filterValues, setFilterValues] = useState({sval: '',stype: '', page:''});
    const [fromItem, setFromItem] = useState(0)
    const [toItem, setToItem] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(0);
    const [totalItems, setTotalItems] = useState(0);  // Total items count from API or static data
    const [currentPage, setCurrentPage] = useState(1);
    const debouncedValue = useDebounce(filterValues, 500);

    useEffect(() => {
        const queryString = new URLSearchParams(filterValues).toString();
        if (debouncedValue) {
            getEventsListing(queryString);
        }
    },[debouncedValue])
    
    const handleDownloadAction = (file) => {
        const anchor = document.createElement('a');
        anchor.href = file;
        anchor.target = "_blank";
        anchor.download = 'demo';
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    }

    const convertTo12Hour = (time) => {
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

    function handleSearch(e) {
        const { name, value } = e.target;
        setSearchValue(value)
        const updatedValues = {
        ...filterValues,
        [name]: value,
        };

        setFilterValues(updatedValues);
    }
    
    function handleFilter(e) {
        const { name, value } = e.target;
        setSorting(value);
        const updatedValues = {
        ...filterValues,
        [name]: value,
        };
        setFilterValues(updatedValues);
    }
    const handleSearchAction = () => {
        const queryString = new URLSearchParams(filterValues).toString();
        getEventsListing(queryString);
    }

    const handleResetAction = () => {
        const updatedValues = {
            ...filterValues,
            ['sval']: '',
            ['stype']: '',
            ['page']: '',
        };
        setFilterValues(updatedValues);
        setSearchValue('');
        setSorting('');
        setCurrentPage(1);
    }

    const getEventsListing = (queryString) => {
        Action.getEvents(queryString).then((data) => {
            if(data.success == true)
            {
                setEvents(data.data.data);
                setFromItem(data.data?.from);
                setToItem(data.data?.to)
                setItemsPerPage(data.data?.per_page)
                setTotalItems(data.data?.total)
                setLoader(false);
            }
        }).catch((error) => {
            setLoader(false);
            toast.error('unable to get event listing');
            console.log(error);
        });
    }
    const handlePageChange = (page) => {
        const updatedValues = {
            ...filterValues,
            ['page']: page,
        };
        setFilterValues(updatedValues);
        setCurrentPage(page);
    };
    return (
        <>
            <div className="border-b mb-8">
                <h1 className="text-3xl text-[#002855] font-light pb-5">Committee Meetings</h1>
            </div>
            <div className="flex justify-end text-center">
                <Link href={`/admin/events/create`} className="w-44 py-2 px-6 bg-primary flex items-center justify-center font-medium"><FaPlus size={16} className="mr-1" />Create</Link>
            </div>
            <div className="flex justify-between items-center">
                <div className="flex">
                    <input 
                        type="text"
                        name="sval"
                        value={searchValue}
                        placeholder="Search" 
                        onChange={(e) => {
                            handleSearch(e);
                        }}
                        className="focus:outline-none border-b py-2 px-2"
                    />
                    <select 
                        className="w-48 focus:outline-none py-2 px-4 border text-[#002855] font-light"
                        name="stype"
                        value={sorting}
                        onChange={(e) => {
                            handleFilter(e);
                        }}
                    >
                        <option value=''>Filter</option>
                        <option value={`newest to oldest`}>Newest to Oldest</option>
                        <option value={`oldest to newest`}>Oldest to Newest</option>
                    </select>
                    <button className="bg-primary px-4 py-2 ml-2 mr-2 text-white" onClick={handleSearchAction}><CiSearch size={18}/></button>
                    <button className="bg-primary px-4 py-2 ml-2 mr-2 text-white" onClick={handleResetAction}><GrPowerReset size={18}/></button>
                </div>
                <p className="text-[#555555] font-medium">Showing {fromItem} to {toItem} of {totalItems} Events</p>
            </div>
            <div className="mt-8">
                {
                    (loader == true) ? <DocumentSkeleton /> : <>
                        {
                            (events.length > 0) ? <>
                                {
                                    events.map((event, index) => (
                                        <div key={index} className="bg-[#C1DFE0] py-4 px-4 flex justify-between items-center mb-4 rounded">
                                            <div className="flex flex-1 items-center">
                                                <div className="rounded-sm mr-2 text-center">
                                                    <Moment format="D" className="block text-center bg-primary text-[#002855] px-3 py-1">
                                                        {event?.date}
                                                    </Moment>
                                                    <Moment format="MMM" className="text-lg font-bold block text-center bg-white text-[#002855] px-3 py-2">
                                                        {event?.date}
                                                    </Moment>
                                                </div>
                                                <div>
                                                    <p className="block text-xl font-medium mb-1 text-[#002855]">{event?.title}</p>
                                                    <span className="block text-[#646464] text-sm font-medium mb-1">
                                                    <Moment format="D MMM YYYY" className="mr-2">
                                                        {event?.date}
                                                    </Moment>
                                                    {convertTo12Hour(event?.time_from)} {convertTo12Hour(event?.time_to)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="">
                                                <Link href="" className="py-2 px-4 bg-primary text-[#002855] w-auto inline-block text-center rounded ml-2 mr-2" onClick={() => handleDownloadAction(event?.file)}>Download</Link>
                                                <Link href={`/admin/events/edit/${event?.id}`} className="py-2 px-4 bg-primary text-[#002855] w-auto inline-block text-center rounded ml-2 mr-2">Edit</Link>
                                                <Link href={`/admin/events/notification/${event?.id}`} className="py-2 px-4 bg-primary text-[#002855] w-auto inline-block text-center rounded ml-2 mr-2">Notification</Link>
                                                <Link href={`/admin/events/view/${event?.id}`} className="py-2 px-4 bg-primary text-[#002855] w-auto inline-block text-center rounded ml-2 mr-2">View</Link>
                                            </div>
                                        </div>
                                    ))

                                }
                                <div>
                                    <Pagination 
                                        totalItems={totalItems}
                                        itemsPerPage={itemsPerPage}
                                        currentPage={currentPage}
                                        onPageChange={handlePageChange}
                                    />
                                </div>
                            </> : <>
                            <div className="bg-[#C1DFE0] py-4 px-4 flex justify-between items-center mb-4 rounded">
                                <div className="flex flex-1 items-center">
                                    No Data Found!
                                </div>
                            </div>
                            </>
                        }
                    </>
                }
            </div>
        </>
    )
}

export default EventLiting;
import Image from "next/image";
import ProfileImg from "../../public/assets/images/no_image.jpg";

const ProfileUpdate = () => {
    return (
        <>
            <div className="border w-1/2 py-7 px-7">
                <form>
                    <div className="flex justify-between">
                        <label className="block mb-4 w-1/2 mr-2">
                            <span className="block text-sm font-normal mb-3 text-[#002855]">First Name</span>
                            <input 
                                type="text" 
                                value="" 
                                className="mt-1 h-11 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none"
                            />
                        </label>
                        <label className="block mb-4 w-1/2 ml-2">
                            <span className="block text-sm font-normal mb-3 text-[#002855]">Last Name</span>
                            <input 
                                type="text" 
                                value="" 
                                className="mt-1 h-11 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none"
                            />
                        </label>
                    </div>
                    <label className="block mb-4">
                        <span className="block text-sm font-normal mb-3 text-[#002855]">Job Title</span>
                        <input 
                            type="text" 
                            value="" 
                            className="mt-1 h-11 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none"
                        />
                    </label>
                    <label className="block mb-4">
                        <span className="block text-sm font-normal mb-3 text-[#002855]">Email</span>
                        <input 
                            type="text" 
                            value="" 
                            className="mt-1 h-11 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none"
                        />
                    </label>
                    <label className="block mb-4">
                        <span className="block text-sm font-normal mb-3 text-[#002855]">Phone Number</span>
                        <input 
                            type="text" 
                            value="" 
                            className="mt-1 h-11 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none"
                        />
                    </label>
                    <div className="flex justify-between">
                        <label className="block mb-4 w-1/2 mr-2">
                            <span className="block text-sm font-normal mb-3 text-[#002855]">Company</span>
                            <input 
                                type="text" 
                                value="" 
                                className="mt-1 h-11 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none"
                            />
                        </label>
                        <label className="block mb-4 w-1/2 ml-2">
                            <span className="block text-sm font-normal mb-3 text-[#002855]">Website</span>
                            <input 
                                type="text" 
                                value="" 
                                className="mt-1 h-11 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none"
                            />
                        </label>
                    </div>
                    <label className="block mb-4">
                        <span className="block text-sm font-normal mb-3 text-[#002855]">Address</span>
                        <input 
                            type="text" 
                            value="" 
                            className="mt-1 h-11 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none"
                        />
                    </label>
                    <div className="flex justify-between">
                        <label className="block mb-4 w-1/2 mr-2">
                            <span className="block text-sm font-normal mb-3 text-[#002855]">City</span>
                            <input 
                                type="text" 
                                value="" 
                                className="mt-1 h-11 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none"
                            />
                        </label>
                        <label className="block mb-4 w-1/2 ml-2">
                            <span className="block text-sm font-normal mb-3 text-[#002855]">Province</span>
                            <input 
                                type="text" 
                                value="" 
                                className="mt-1 h-11 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none"
                            />
                        </label>
                    </div>
                    <div className="flex justify-between">
                        <label className="block mb-4 w-1/2 mr-2">
                            <span className="block text-sm font-normal mb-3 text-[#002855]">Country</span>
                            <input 
                                type="text" 
                                value="" 
                                className="mt-1 h-11 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none"
                            />
                        </label>
                        <label className="block mb-4 w-1/2 ml-2">
                            <span className="block text-sm font-normal mb-3 text-[#002855]">Postal Code</span>
                            <input 
                                type="text" 
                                value="" 
                                className="mt-1 h-11 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none"
                            />
                        </label>
                    </div>
                    <label className="block mb-4 w-full ml-2">
                        <span className="block text-sm font-normal mb-3 text-[#002855]">Image</span>
                        <input 
                            type="file" 
                            value="" 
                            className="mt-1 h-11 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none"
                        />
                    </label>
                    <Image src={ProfileImg}  width={100} height={100} alt="profile-image"/>
                    <button className="bg-primary py-2 px-8 text-sm text-[#002855] font-medium mt-4">Update</button>
                </form>
            </div>
        </>
    )
}

export default ProfileUpdate;
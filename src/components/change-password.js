const PasswordChange = () => {
    return (
        <>
            <div className="border w-1/2 py-7 px-7">
                <form>
                    <label className="block mb-4">
                        <span className="block text-sm font-normal mb-3 text-[#002855]">Current Password</span>
                        <input 
                            type="text" 
                            value="" 
                            className="mt-1 h-11 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none"
                        />
                    </label>
                    <label className="block mb-4">
                        <span className="block text-sm font-normal mb-3 text-[#002855]">New Password</span>
                        <input 
                            type="text" 
                            value="" 
                            className="mt-1 h-11 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none"
                        />
                    </label>
                    <label className="block mb-4">
                        <span className="block text-sm font-normal mb-3 text-[#002855]">Confirm New Password</span>
                        <input 
                            type="text" 
                            value="" 
                            className="mt-1 h-11 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none"
                        />
                    </label>
                    <button className="bg-primary py-2 px-8 text-sm text-[#002855] font-medium">Change Password</button>
                </form>
            </div>
        </>
    )
}

export default PasswordChange;
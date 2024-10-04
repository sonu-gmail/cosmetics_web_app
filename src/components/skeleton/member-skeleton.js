import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'

const MemberSkeleton = () => {
    return (
        <>
            
            <div className="w-full mt-8">
                <table className="border w-full">
                    <thead className="bg-primary">
                        <tr>
                            <th className="w-auto px-6 py-3 text-left text-xs font-medium text-[#002854] uppercase border-r border-r-[#35a694]">First Name</th>
                            <th className="w-auto px-6 py-3 text-left text-xs font-medium text-[#002854] uppercase border-r border-r-[#35a694]">Last Name</th>
                            <th className="w-auto px-6 py-3 text-left text-xs font-medium text-[#002854] uppercase border-r border-r-[#35a694]">Company / Association</th>
                            <th className="w-auto px-6 py-3 text-left text-xs font-medium text-[#002854] uppercase border-r border-r-[#35a694]">Job Title</th>
                            <th className="w-auto px-4 py-3 text-left text-xs font-medium text-[#002854] uppercase border-r border-r-[#35a694]">Member of Committee</th>
                            <th className="w-auto px-6 py-3 text-left text-xs font-medium text-[#002854] uppercase border-r border-r-[#35a694]">Email</th>
                            <th className="w-auto px-6 py-3 text-left text-xs font-medium text-[#002854] uppercase border-r border-r-[#35a694]">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Array(10).fill().map((item, index) => (
                                <tr key={index}>
                                    <td className="w-48"><Skeleton height={30} width={`100%`} /></td>
                                    <td className="w-48"><Skeleton height={30} width={`100%`} /></td>
                                    <td className="w-48"><Skeleton height={30} width={`100%`} /></td>
                                    <td className="w-48"><Skeleton height={30} width={`100%`} /></td>
                                    <td className="w-48"><Skeleton height={30} width={`100%`} /></td>
                                    <td className="w-48"><Skeleton height={30} width={`100%`} /></td>
                                    <td className="w-48"><Skeleton height={30} width={`100%`} /></td>
                                </tr>

                            ))
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}
export default MemberSkeleton;
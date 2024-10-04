import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'

const IssueSkeleton = () => {
    return (
        <>
            
            <div className="w-full mt-8">
                <table className="border w-full">
                    <thead>
                        <tr className="uppercase bg-primary text-sm text-white font-light">
                            <th className="py-4 px-3">Issue</th>
                            <th className="py-4 px-3">Proprity</th>
                            <th className="py-4 px-3">Actions</th>
                            <th className="py-4 px-3">Brief Description</th>
                            <th className="py-4 px-3">Actions</th>
                            <th className="py-4 px-3">Actions</th>
                            <th className="py-4 px-3">External Deadline</th>
                            <th className="py-4 px-3">Internal Deadline</th>
                            <th className="py-4 px-3">Status</th>
                            <th className="py-4 px-3">Action</th>
                            <th className="py-4 px-3">Last Updated</th>
                            <th className="py-4 px-3">Archive</th>
                            <th className="py-4 px-3">Final Document</th>
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
export default IssueSkeleton;
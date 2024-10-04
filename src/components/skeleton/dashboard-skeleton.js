import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'

const DashboardSkeleton = () => {
    return (
        <>
            <div className="flex justify-between mt-6">
                <div className="w-1/2 mr-8">
                    <div className="mb-8">
                        <h3 className="text-xl font-medium text-[#002755] mb-4"><Skeleton height={30} width={`50%`} /></h3>
                        <Skeleton height={100} width={`100%`} />
                    </div>
                    <div className="mb-8">
                        <h3 className="text-xl font-medium text-[#002755] mb-4"><Skeleton height={30} width={`50%`} /></h3>
                        <Skeleton height={100} width={`100%`} />
                    </div>
                </div>
                <div className="w-1/2">
                    <h3 className="text-xl font-medium text-[#002755] mb-4"><Skeleton height={30} width={`50%`} /></h3>
                    <table>
                        <tbody>
                            {
                                Array(4).fill().map((item, index) => (
                                    <tr key={index}>
                                        <td className="w-48"><Skeleton height={100} width={100} /></td>
                                        <td className="w-5/6">
                                            <Skeleton height={30} width={`100%`} />
                                            <Skeleton height={65} width={`100%`} />
                                        </td>
                                    </tr>

                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}
export default DashboardSkeleton;
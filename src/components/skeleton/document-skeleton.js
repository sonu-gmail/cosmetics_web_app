import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'

const DocumentSkeleton = () => {
    return (
        <>
            {
                Array(4).fill().map((item, index) => (
                    <Skeleton height={100} width={`100%`} key={index}/>

                ))
            }
        </>
    )
}
export default DocumentSkeleton;
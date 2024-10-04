import { getServerAuthSession } from "../../api/auth/auth";
import { redirect } from "next/navigation";
import Dashboard from "../../../components/dashboard";

const AdminDashboard = async () => {
    const session = await getServerAuthSession();
    if(!session?.user) {
        redirect('/login');
    }

    return (
        <>
            <div className="">
                <h1 className="text-xl font-extralight">Welcome, <b>{session?.user?.first_name+' '+session?.user?.last_name}!</b></h1>
            </div>
            <Dashboard />
        </>
    )
}

export default AdminDashboard
import Link from "next/link";
import LoginForm from "../../components/login";
import { getServerAuthSession } from "../api/auth/auth";
import { redirect } from "next/navigation";

const Login = async () => {
    const session = await getServerAuthSession();
    console.log(session);
    if(session?.user) {
        redirect('/admin');
    }
    return (
        <div className="h-screen flex flex-col items-center justify-center antialiased">
            <div className="shadow-lg">
                <div className="flex justify-between py-4 px-5 bg-primary">
                    <p className="text-sm font-medium text-white uppercase">Sign In</p>
                    <Link href={''} className="text-sm font-light text-white text-opacity-70 hover:text-white">Forgot Password?</Link>
                </div>
                <div className="py-12 px-5">
                    <h1 className="text-2xl font-semibold text-black leading-loose">Cosmetics Alliance Committee Portal</h1>
                    <p className="text-base mb-5 text-[#646464]">Welcome, please login.</p> 
                    <LoginForm />
                </div>
            </div> 
        </div> 
    )
}

export default Login;
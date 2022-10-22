import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {User} from '@/utils/types'
import { signIn } from "next-auth/react";
import { userSchema } from "@/utils/validations";
import Loader from "@/components/Loader";
import {NotifyContext} from '@/context/notification';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useContext } from "react";
import ForgotPassword from "@/components/ForgotPassword";

function SignIn() {
    const { register, handleSubmit, formState: { errors }, } = useForm<User>({ resolver: yupResolver(userSchema), });
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isForgotPass, showFP] = useState(false)
    const {setNotify} = useContext(NotifyContext);

    const onSubmit = async(data: FieldValues) => {
      setIsLoading(true);
      try {
          const res = await signIn('credentials', {...data, redirect: false});
          setIsLoading(false);
          if (!res?.ok) setNotify({
            heading: "ERROR",
            message: "Invalid email or password",
            type: "error"
          })
      } catch (error:any) {
        setIsLoading(false);
        setNotify({
            heading: "ERROR",
            message: error.message,
            type: "error"
          })
      }
    };

    return (
        <div className="grid place-items-center h-screen">
            {isForgotPass ? <ForgotPassword showForgotPassword={() =>showFP(false)}/> : ""}
            <div className="border-b shadow rounded-md bg-gray-100 max-w-2xl w-full">
                <div className="py-10 px-4 bg-blue-600 text-white rounded-md shadow-sm">
                <h1 className="font-bold text-3xl mb-4"> Log In </h1>
                <p className="pl-5">or <button>Create an account</button></p>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className='p-4'>
                    <input
                        className="outline-none p-2 rounded-md shadow-sm bg-white w-full my-3 border-b"
                        placeholder="Enter your email"
                        type="email"
                        {...register("email")}
                    />
                     <p className="my-2 text-red-500">{errors.email?.message}</p>
                    <div className='flex rounded-md shadow-sm bg-white w-full my-3 border-b'>
                        <input
                            className="outline-none p-2 rounded-md w-full"
                            placeholder="Password"
                            type={showPassword ? "text" : "password"}
                            {...register("password")}
                        />
                        <button type='button' onClick={() => setShowPassword(!showPassword)} className='mx-4'>{showPassword ? <FaEyeSlash /> : <FaEye />}</button>
                    </div>
                     <p className="my-2 text-red-500">{errors.password?.message}</p>
                     <button type="button" onClick={() => showFP(true)} className="underline text-blue-700"> Forgot Password? </button>
                    <button
                        className="p-2 bg-blue-600 text-white rounded-md w-full my-3 block shadow-md"
                        disabled={isLoading ? true : false}
                        type="submit"
                    >
                    {isLoading ? <Loader/>: "Log in"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default SignIn;

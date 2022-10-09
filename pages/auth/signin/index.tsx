import React from "react";
import { FieldValues, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {User} from '@/utils/types'
import { signIn } from "next-auth/react";
import { userSchema } from "@/utils/validations";

function SignIn() {
    const { register, handleSubmit, formState: { errors }, } = useForm<User>({ resolver: yupResolver(userSchema), });

    const onSubmit = async(data: FieldValues) => {
        const res = await signIn('credentials', {...data, redirect: false});
        console.log(res);
    };

    return (
        <div className="grid place-items-center h-screen">
            <div className="border-b shadow rounded-md bg-gray-100 max-w-2xl w-full">
                <div className="py-10 px-4 bg-blue-600 text-white rounded-md shadow-sm">
                <h1 className="font-bold text-3xl"> SIGN IN </h1>
                <p className="pl-5">or <button>SIGN UP</button></p>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className='p-4'>
                    <input
                        className="outline-none p-2 rounded-md shadow-sm bg-white w-full my-3 border-b"
                        placeholder="Enter your email"
                        type="email"
                        {...register("email")}
                    />
                     <p className="my-2 text-red-500">{errors.email?.message}</p>
                    <input
                        className="outline-none p-2 rounded-md shadow-sm bg-white w-full my-3 border-b"
                        placeholder="Enter your password"
                        type="password"
                        {...register("password")}
                    />
                     <p className="my-2 text-red-500">{errors.password?.message}</p>
                    <button
                        className="p-2 bg-blue-600 text-white rounded-md w-full my-3 block shadow-md"
                        type="submit"
                    >
                        Log in
                    </button>
                </form>
            </div>
        </div>
    );
}

export default SignIn;

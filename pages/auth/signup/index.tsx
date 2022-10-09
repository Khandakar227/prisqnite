import React from 'react'
import { FieldValues, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { UserInfo } from '@/utils/types';
import signUp from '@/utils/api/signup';
import { userInfoSchema } from '@/utils/validations';

function SignUp() {
  const { register, handleSubmit, formState: { errors }, } = useForm<UserInfo>({ resolver: yupResolver(userInfoSchema), });
  
  const onSubmit = async(data: FieldValues) => {
    const res = await signUp(data);
    console.log(res);
};
  return (
    <div className="grid place-items-center h-screen">
      <div className="border-b shadow rounded-md bg-gray-100 max-w-2xl w-full">
      <div className="py-10 px-4 bg-blue-600 text-white rounded-md shadow-sm">
        <h1 className="font-bold text-3xl"> SIGN UP </h1>
        <p className="pl-5">or <button>SIGN IN</button></p>
      </div>
        <form onSubmit={handleSubmit(onSubmit)} className='p-4'>
          <div className='block sm:flex justify-between'>
            <input className="outline-none p-2 rounded-md shadow-sm bg-white my-3 border-b"
                  placeholder="First name"
                  type="text"
                  {...register("firstname")}
              />
              <input className="outline-none p-2 rounded-md shadow-sm bg-white my-3 border-b"
                  placeholder="Last name"
                  type="text"
                  {...register("lastname")}
              />
          </div>
            <p className="my-2 text-red-500">{errors.lastname?.message || errors.lastname?.message}</p>
          <input className="outline-none p-2 rounded-md shadow-sm bg-white w-full my-3 border-b"
              placeholder="Email"
              type="email"
              {...register("email")}
          />
            <p className="my-2 text-red-500">{errors.email?.message}</p>
          <input
              className="outline-none p-2 rounded-md shadow-sm bg-white w-full my-3 border-b"
              placeholder="Password"
              type="password"
              {...register("password")}
          />
            <p className="my-2 text-red-500">{errors.password?.message}</p>
            <button
                className="p-2 bg-blue-600 text-white rounded-md w-full my-3 block shadow-md"
                type="submit"
            >
                Sign up
            </button>
        </form>
      </div>
    </div>
  )
}

export default SignUp
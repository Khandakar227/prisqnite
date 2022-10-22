import {useContext, useState} from 'react'
import { FieldValues, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { UserInfo } from '@/utils/types';
import signUp from '@/utils/api/signup';
import { userInfoSchema } from '@/utils/validations';
import {FaEye, FaEyeSlash} from 'react-icons/fa';
import Loader from '@/components/Loader';
import { NotifyContext } from '@/context/notification';

interface NewUserInfo extends UserInfo {
  confirmPassword: string;
}
function SignUp() {
  const { register, handleSubmit, formState: { errors }, } = useForm<NewUserInfo>({ resolver: yupResolver(userInfoSchema), });

  const [showPassword, setShowPassword] = useState(false)
  const [showConPassword, setShowConPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const {setNotify} = useContext(NotifyContext)
  
  const onSubmit = async(data: FieldValues) => {
    try {
      setIsLoading(true);
      const res = await signUp(data);
      console.log(res);
      setIsLoading(false);
    } catch (error:any) {
      console.log(error.message);
      setNotify({
        heading: "ERROR",
        message: error.message,
        type: "error"
      })
      setIsLoading(false);
    }
};
  return (
    <div className="grid place-items-center h-screen">
      <div className="border-b shadow rounded-md bg-gray-100 max-w-2xl w-full">
      <div className="py-10 px-4 bg-blue-600 text-white rounded-md shadow-sm">
        <h1 className="font-bold text-3xl mb-4"> Create an account </h1>
        <p className="pl-5">or <button>LOG IN</button></p>
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
          <div className='flex rounded-md shadow-sm bg-white w-full my-3 border-b'>
            <input
                className="outline-none p-2 rounded-md w-full"
                placeholder="Confirm password"
                type={showConPassword ? "text" : "password"}
                {...register("confirmPassword")}
            />
            <button type='button' onClick={() => setShowConPassword(!showConPassword)} className='mx-4'>{showConPassword ? <FaEyeSlash /> : <FaEye />}</button>
          </div>
            <p className="my-2 text-red-500">{errors.confirmPassword?.message}</p>
            <button
                className="p-2 bg-blue-600 text-white rounded-md w-full my-3 block shadow-md"
                type="submit"
                disabled={isLoading ? true : false}
            >
              {isLoading ? <Loader/>: "Sign up"}
            </button>
        </form>
      </div>
    </div>
  )
}

export default SignUp
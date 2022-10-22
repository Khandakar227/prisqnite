import { scryptSync, timingSafeEqual } from 'crypto'
import {GetServerSidePropsContext} from 'next'
import {useRouter} from 'next/router'
import Prisma from '@/utils/api/db'
import { FieldValues, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { passwordSchema } from '@/utils/validations';
import { useState } from 'react';
import { useContext } from 'react';
import { NotifyContext } from '@/context/notification';

const prisma = Prisma.getPrisma();

function ResetPassword({error, status, email, token}:{error: string, status: number, email:string, token: string}) {
  const { register, handleSubmit, formState: { errors }, } = useForm<{password:string}>({ resolver: yupResolver(passwordSchema), });
  const [submissionError, setSubmissionError] = useState({message: ""});
  const [submissionResponse, setSubmissionResponse] = useState({message: ""});
  const {notify, setNotify} = useContext(NotifyContext)

  async function onSubmit(data: FieldValues) {
    try {
      const body = {
        token, email, password: data.password
      }
      console.log(body)
      const options = {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(body)
      };
      
      const res =  await fetch('/api/auth/resetpassword', options)
      if (!res.ok) {
        setSubmissionError({message: res.statusText});
        setNotify({
          heading: "ERROR",
          message: res.statusText,
          type: "error"
        })
        return;
      }
      setSubmissionResponse({message: "Password has been changed. You will soon be redirected to Login page"})
      setNotify({
        heading: "SUCCESS",
        message: "Password has been changed. You will soon be redirected to Login page",
        type: "success"
      })
      setTimeout(() =>{
        location.replace("/auth/signin");
      }, 5000)
      
    } catch (err:any) {
      console.log(err);
      setSubmissionError({message:"Something went wrong. "+ err.message});
      setNotify({
        heading: "ERROR",
        message: "Something went wrong. "+ err.message,
        type: "error"
      })
    }
  }
    
  if (status)
    return(
      <>
      Status: {status}<br/>
      Error occured.Status: {status}<br/>
      {error}
      </>
    )
  if (!submissionResponse.message)
    return (
      <div className='w-full h-full p-6 flex justify-center items-center'>
        <div className='p-4 rounded shadow'>
          <span className="mt-2 mb-4 text-red-500">{errors.password?.message || submissionError.message}</span>
          <form onSubmit={handleSubmit(onSubmit)} >
            <input className='p-4 my-4 rounded border shadow w-full outline-none' placeholder='Password' type="password" {...register("password")} />
            <button className='py-6 px-4 font-bold bg-blue-800 text-white w-full shadow'>Reset password</button>
          </form>
        </div>
      </div>
    )
  else
      return (
        <div className='w-full h-full p-6 flex justify-center items-center'>
          <div className='p-4 rounded shadow'>
            <p className='py-4 px-2 font-bold text-3xl'>{submissionError.message}</p>
          </div>
        </div>
      )
}
export async function getServerSideProps(context:GetServerSidePropsContext) {
  try {
    const {query} = context;
    //If no email or token in the query through error
    if (!query.token || !query.email) {
      console.log("No token or email found");
      return {
        props: { error: "Invalid token or email", status: 400 }
      }
    }
    const resetToken = await prisma.resetToken.findUnique({
      where: {email: query.email as string}
    });
    // If no token found for the email or token was used through error
    if (!resetToken || resetToken.used) {
      console.log("No token or token was used");
      return {
        props: { error: "Invalid token or email", status: 400 }
      }
    }
    //Validate the token
    const [salt, key] = (resetToken.token as string).split(":");
    console.log(salt , key)
    if (!salt || !key) {
      console.log("Invalid token");
      return {
        props: { error: "Invalid token or email", status: 400 }
      }
    }
    const hashedBuffer = scryptSync(query.token as string, salt, 64);
    const keyBuffer = Buffer.from(key, "hex");
    const match = timingSafeEqual(hashedBuffer, keyBuffer);

    //Check if matched 
    if (!match) {
      console.log("Token does not match");
      return {props: { error: "Invalid token or email", status: 400 }}
    }
    //Check if token expired
    if (!resetToken.expiresIn || Date.now() - parseInt(resetToken.expiresIn) > 0) {
      console.log("Token expired")
      return { props: { error: "Invalid token or email", status: 400 } }
    }

    return {
      props: {email: resetToken.email, token: query.token},
    }
    
  } catch (error:any) {
    return {
      props: {error: error?.message, status: 500},
    }
  }
}
export default ResetPassword
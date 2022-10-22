import { yupResolver } from "@hookform/resolvers/yup";
import { FieldValues, useForm } from "react-hook-form";
import { object, string } from "yup";

function ForgotPassword({
    showForgotPassword,
}: {
    showForgotPassword: Function;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>({
    resolver: yupResolver(
      object({
          email: string().email().required(),
      })
      ),
    });

    function close(e: MouseEvent) {
        if ((e.target as HTMLElement).dataset.name == "forgot-password-wrapper")
      showForgotPassword();
  }
  async function onSubmit(data: FieldValues) {
    const body = {email: data.email}
    const options = {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(body)
      };
      const res =  await fetch('/api/auth/resetpassword', options);
    //   Try catch handler required
  }
// @ts-ignore
  return (
      <div
      data-name="forgot-password-wrapper"
      className="fixed w-screen h-screen bg-black bg-opacity-25 flex justify-center items-center"
      onClick={close}
    >
      <div className="p-4 rounded-md shadow bg-white max-w-lg">
        <h1 className="font-bold text-xl pb-4"> Forgot your password? </h1>
        <p className="pb-8">
          Enter the email address you used to create the account. We'll send you
          a link for resetting the password.
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="email"
            placeholder="Enter your email address"
            className="p-4 shadow border-b rounded-md w-full placeholder:text-gray-500 outline-none"
            {...register("email")}
          />
          <button type="submit" className="w-full p-4 rounded-md shadow bg-blue-500 text-white block my-4">
            Send Password reset link
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;

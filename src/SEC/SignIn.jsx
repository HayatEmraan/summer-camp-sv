import React, { useRef, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import logo from "../assets/logo/logo.jpg";
import { CgSpinnerTwo } from "react-icons/cg";
import { toast } from "react-hot-toast";
import useAuth from "../Hooks/useAuth";
import { useGoogle } from "../Hooks/useGoogle";
const SignIn = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/";
  const { signIn, signInWithGoogle, resetPassword, loading } =
    useAuth();
  const emailRef = useRef(null);
  const resetPasswordHandler = () => {
    if (emailRef) {
      resetPassword(emailRef.current.value)
        .then((res) => {
          toast.success("Reset password link sent to your email!");
        })
        .catch((err) => {
          toast.error("Something went wrong. Please try again!");
        });
    }
  };
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [eyeActive, setEyeActive] = useState(false);
  const onSubmit = (data) => {
    signIn(data.email, data.password)
      .then((res) => {
        toast.success("Successfully logged In!");
        navigate(from, { replace: true });
      })
      .catch((err) => {
        toast.error("Something went wrong. Please try again!");
      });
  };
  const handleSignInWithGoogle = () => {
    signInWithGoogle()
      .then((res) => {
        const date = new Date().toLocaleDateString();
        const role = "user";
        useGoogle(
          res.user.email,
          res.user.displayName,
          date,
          role,
          res.user.photoURL
        );
        navigate(from, { replace: true });
        toast.success("Authentication Successful!");
      })
      .catch((err) => {
        toast.error("Something went wrong. Please try again!");
      });
  };
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="container xl:mx-auto mx-4 xl:w-1/4 lg:w-1/3 md:w-1/2 w-full border p-8 shadow-md rounded-xl">
        <Link to="/">
          <img src={logo} alt="" />
        </Link>
        <div className="mt-8">
          <h2 className="text-2xl font-bold">Welcome back, Olivia</h2>
          <p>Continue with Google or enter your details</p>
          <div
            onClick={handleSignInWithGoogle}
            className="flex justify-center items-center space-x-2 border my-6 p-2 border-gray-300 border-rounded cursor-pointer"
          >
            <FcGoogle size={32} />

            <p>Continue with Google</p>
          </div>
          <div className="divider mb-20">or</div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col space-y-6"
          >
            <input
              type="email"
              className="border-b border-gray-400 focus:outline-none"
              {...register("email", { required: true })}
              placeholder="Email"
              ref={emailRef}
            />
            <div className="relative">
              <input
                type={`${eyeActive ? "text" : "password"}`}
                className="border-b border-gray-400 focus:outline-none w-full"
                {...register("password", { required: true })}
                placeholder="Password"
              />
              <div className="absolute top-0 right-0 text-xl cursor-pointer">
                {eyeActive ? (
                  <AiFillEye
                    onClick={() => setEyeActive(!eyeActive)}
                  ></AiFillEye>
                ) : (
                  <AiFillEyeInvisible
                    onClick={() => setEyeActive(!eyeActive)}
                  ></AiFillEyeInvisible>
                )}
              </div>
            </div>
            <div className="text-end" onClick={resetPasswordHandler}>
              <small className="hover:underline cursor-pointer hover:text-rose-500 text-gray-600">
                Reset Password
              </small>
            </div>
            {loading ? (
              <div className="bg-black text-white text-3xl rounded-md py-2">
                <CgSpinnerTwo
                  className="animate-spin mx-auto"
                  size={28}
                ></CgSpinnerTwo>
              </div>
            ) : (
              <input
                type="submit"
                value="Sign In"
                className="bg-black text-white py-2 rounded-md cursor-pointer text-xl font-semibold"
              />
            )}
          </form>
          <div className="mt-8 text-center">
            <p className="px-6 text-sm text-center text-gray-400">
              Don't have an account yet?{" "}
              <Link
                to="/signup"
                className="hover:underline hover:text-rose-500 text-gray-600"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

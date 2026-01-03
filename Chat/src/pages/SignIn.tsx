import { SigninForm } from "@/components/auth/signin-form"

const SignIn = () => {
  return (
    <div className=" bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10 absolute inset-0 z-0  ">
      <div className=" w-full max-w-sm md:max-w-3xl scale-85">
        <SigninForm />
      </div>
    </div>)
}
export default SignIn
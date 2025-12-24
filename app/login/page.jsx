import { UserAuthForm } from '@/components/custom/login/user-auth-form'

export const metadata = {
  title: 'SMS - Login',
  description: 'Login to SMS account'
}
export const revalidate = 0
const LoginPage = () => {
  return (
    <div className="lg:p-8 h-full">
      <div className="mx-auto flex w-full h-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
          <p className="text-sm text-muted-foreground">
            Enter your username and password below to login to your account
          </p>
        </div>
        <UserAuthForm />
      </div>
    </div>
  )
}

export default LoginPage

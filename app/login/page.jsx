import { UserAuthForm } from '@/components/custom/login/user-auth-form'

export const metadata = {
  title: 'SMS - Login',
  description: 'Login to SMS account'
}
export const revalidate = 0
const LoginPage = () => {
  return (
    <div className="flex h-full items-center justify-center p-4 md:p-8">
      <div className="mx-auto flex w-full max-w-sm flex-col justify-center space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Login</h1>
          <p className="text-sm text-muted-foreground md:text-base">
            Enter your username and password below to login to your account
          </p>
        </div>
        <UserAuthForm />
      </div>
    </div>
  )
}

export default LoginPage

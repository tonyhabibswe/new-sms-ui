import { CalendarDays, ClipboardCheck, GraduationCap, Sheet } from 'lucide-react'
import { UserAuthForm } from '@/components/custom/login/user-auth-form'

export const metadata = {
  title: 'SMS - Login',
  description: 'Login to SMS account'
}
export const revalidate = 0

const FEATURES = [
  { icon: CalendarDays, label: 'Semesters, holidays and course sections' },
  { icon: ClipboardCheck, label: 'Attendance for every session' },
  { icon: Sheet, label: 'Weighted gradebook with Excel export' }
]

const eyebrow =
  'text-xs font-semibold uppercase leading-4 tracking-eyebrow text-faint lg:text-sm lg:leading-5'

// Desktop: what SMS does on the left, the sign-in card on the right.
// Phones: the logo, then the form.
const LoginPage = () => {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-background lg:flex-row">
      <section className="px-6 pt-14 lg:flex lg:flex-1 lg:px-16 lg:py-14">
        <div className="mx-auto flex max-w-[420px] flex-col justify-between gap-12 lg:mx-0 lg:max-w-[620px]">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-brand-400 to-brand-600 text-white">
              <GraduationCap className="h-6 w-6" aria-hidden="true" />
            </span>
            <span className="font-display text-[22px] font-bold leading-7">SMS</span>
          </div>

          <div className="hidden flex-col gap-6 lg:flex">
            <p className={eyebrow}>Student management system</p>
            <h2 className="font-display text-5xl font-bold leading-[56px] tracking-[-1.2px] xl:text-[64px] xl:leading-[73.6px] xl:tracking-[-1.6px]">
              Classes, attendance and grades in one place.
            </h2>
            <p className="text-lg leading-7 text-muted-foreground">
              Plan semesters, take attendance for each session and keep every
              grade in one weighted gradebook.
            </p>
            <ul className="mt-2 flex flex-col gap-3.5">
              {FEATURES.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3.5 text-base">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </div>

          <p className="hidden text-[13px] leading-[18px] text-faint lg:block">
            SMS · CodeWithT
          </p>
        </div>
      </section>

      <main className="flex flex-1 flex-col justify-between gap-10 px-6 pb-8 pt-10 lg:items-center lg:justify-center lg:border-l lg:border-border lg:bg-card lg:py-12">
        <div className="mx-auto flex w-full max-w-[420px] flex-col gap-10 lg:mx-0 lg:gap-6 lg:rounded-panel lg:border lg:border-border lg:bg-card lg:p-10 lg:shadow-hero">
          <div className="flex flex-col gap-3 lg:gap-2">
            <p className={eyebrow}>Welcome back</p>
            <h1 className="font-display text-[34px] font-bold leading-10 lg:text-[40px] lg:leading-[48px]">
              Sign in
            </h1>
            <p className="text-[15px] leading-[22px] text-muted-foreground">
              <span className="lg:hidden">
                Your classes, attendance and grades in one place.
              </span>
              <span className="hidden lg:inline">
                Use the username and password from your administrator.
              </span>
            </p>
          </div>
          <UserAuthForm />
        </div>
        <p className="text-center text-[13px] leading-[18px] text-faint lg:hidden">
          SMS · CodeWithT
        </p>
      </main>
    </div>
  )
}

export default LoginPage

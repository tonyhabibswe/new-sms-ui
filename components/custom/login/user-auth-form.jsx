'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Icons } from '@/components/ui/icons'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from '@/lib/zod'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

const FormSchema = z.object({
  username: z.string().min(1, 'Enter your username'),
  password: z.string().min(1, 'Enter your password')
})

export function UserAuthForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  })

  async function onSubmit(data) {
    setIsLoading(true)
    try {
      const res = await signIn('credentials', {
        username: data.username,
        password: data.password,
        redirect: false
      })

      if (!res.ok) {
        toast({
          variant: 'destructive',
          title: 'Invalid credentials.'
        })
        // Exit early on authentication failure - only redirect on success
        return
      }

      // Only execute redirect on successful authentication
      const redirectUrl = searchParams.get('redirect') || '/'
      // Use replace to prevent back button from returning to login page
      router.replace(redirectUrl)
    } catch (error) {
      console.error(error)
      toast({
        variant: 'destructive',
        title: 'An error occurred during login.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5 lg:gap-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your username"
                  type="text"
                  autoComplete="username"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  className="h-[52px] lg:h-12"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    placeholder="Enter your password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    className="h-[52px] pr-14 lg:h-12"
                    {...field}
                  />
                </FormControl>
                <button
                  type="button"
                  aria-label="Show password"
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((shown) => !shown)}
                  className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:h-10 lg:w-10">
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 lg:h-[18px] lg:w-[18px]" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5 lg:h-[18px] lg:w-[18px]" aria-hidden="true" />
                  )}
                </button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          disabled={isLoading}
          type="submit"
          className="mt-2 h-[52px] text-base lg:mt-0 lg:h-12 lg:text-[15px]">
          {isLoading && <Icons.spinner className="h-4 w-4 animate-spin" />}
          Sign in
        </Button>
      </form>
    </Form>
  )
}

'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { authformSchema } from '@/lib/utils'
import CustomInput from './CustomInput'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { signIn, signUp } from '@/lib/actions/user.actions'
import PlaidLink from './PlaidLink'

const AuthForm = ({ type }: { type: string }) => {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null) // State for error messages

  const formSchema = authformSchema(type)

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      address1: "",
      city: "",
      state: "",
      postalCode: "",
      dateOfBirth: "",
      ssn: "",
    },
  })

  // 2. Define a submit handler.
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    setError(null)  // Reset error state

    try {
      // Sign up with Appwrite and create Dwolla customer
      const userData = {
        firstName: data.firstName!,
        lastName: data.lastName!,
        address1: data.address1!,
        city: data.city!,
        state: data.state!,
        postalCode: data.postalCode!,
        dateOfBirth: data.dateOfBirth!,
        ssn: data.ssn!,
        email: data.email,
        password: data.password,
      }

      if (type === 'sign-up') {
        const response = await signUp(userData)

        if (response?.error) {
          setError(response.error); // Set the error message
        } else {
          setUser(response)
        }
      }

      if (type === 'sign-in') {
        const response = await signIn({ email: data.email, password: data.password })
        if (response) router.push('/')
      }

    } catch (error) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className='auth-form'>
      <header className='flex flex-col gap-5 md:gap-8'>
        <Link href='/' className='mb-12 cursor-pointer items-center gap-2 flex'>
          <Image src='/icons/logo.svg' width={34} height={34} alt='Nika Logo' className='size-[24px] max-xl:size-14' />
          <h1 className='sidebar-logo'>Nika</h1>
        </Link>

        <div className='flex flex-col gap-1 md:gap-3'>
          <h1 className='text-24 lg:text-36 font-semibold text-gray-900'>
            {user
              ? 'Link Account' : type === 'sign-in' ? 'Sign In' : 'Sign Up'
            }
            <p className='text-16 font-normal text-gray-600'>
              {user
                ? 'Link your account to get started'
                : 'Please enter your details'
              }
            </p>
          </h1>
        </div>
      </header>

      {error && (
        <div className="error-message">
          <p className="text-red-500">{error}</p> {/* Display error message */}
        </div>
      )}

      {user ? (
        <div className='flex flex-col gap-4'>
          <PlaidLink user={user} variant='primary' />
        </div>
      ) : (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {type === 'sign-up' && (
                <>
                  <div className='flex gap-4'>
                    <CustomInput control={form.control} name='firstName' label='First Name' placeholder='Enter your first name' />
                    <CustomInput control={form.control} name='lastName' label='Last Name' placeholder='Enter your last name' />
                  </div>

                  <CustomInput control={form.control} name='address1' label='Address' placeholder='Enter your specific address' />
                  <CustomInput control={form.control} name='city' label='City' placeholder='Enter your city' />

                  <div className='flex gap-4'>
                    <CustomInput control={form.control} name='state' label='State' placeholder='Example: Maharashtra' />
                    <CustomInput control={form.control} name='postalCode' label='Postal Code' placeholder='Example: 400094' />
                  </div>

                  <div className='flex gap-4'>
                    <CustomInput control={form.control} name='dateOfBirth' label='Date of Birth' placeholder='YYYY-MM-DD' />
                    <CustomInput control={form.control} name='ssn' label='SSN' placeholder='Example: 1234' />
                  </div>
                </>
              )}

              <CustomInput control={form.control} name='email' label='Email' placeholder='Enter your email' />
              <CustomInput control={form.control} name='password' label='Password' placeholder='Enter your password' />

              <div className='flex flex-col gap-4'>
                <Button type="submit" className='form-btn' disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className='animate-spin' /> &nbsp;
                      Loading...
                    </>
                  ) : type === 'sign-in' ? 'Sign In' : 'Sign Up'
                  }
                </Button>
              </div>

            </form>
          </Form>

          <footer className='flex justify-center gap-1'>
            <p className='text-14 font-normal text-gray-600'>
              {type === 'sign-in' ? "Don't have an acccount?" : "Already have an account?"}
            </p>
            <Link href={type === 'sign-in' ? '/sign-up' : '/sign-in'} className='form-link'>
              {type === 'sign-in' ? "Sign-Up" : "Sign-In"}
            </Link>
          </footer>
        </>
      )}
    </section>
  )
}

export default AuthForm

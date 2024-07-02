import LoginForm from '@/components/auth/login-form'
import React from 'react'

const LoginPage = () => {
  return (
    <main className='rounded flex justify-center align-middle items-center h-screen text-center '>
      <section>
        <LoginForm />
      </section>
    </main>
  )
}

export default LoginPage
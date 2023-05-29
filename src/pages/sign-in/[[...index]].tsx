import { SignIn } from '@clerk/nextjs'

import { Center } from '~/components/Center/Center'
import { Layout } from '~/components/Layout/Layout'
import { Routes } from '~/routes'

export default function SignInPage() {
  return (
    <Layout>
      <Center>
        <SignIn redirectUrl={Routes.rooms} signUpUrl={Routes.signUp} />
      </Center>
    </Layout>
  )
}

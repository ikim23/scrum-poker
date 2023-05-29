import { SignUp } from '@clerk/nextjs'

import { Center } from '~/components/Center/Center'
import { Layout } from '~/components/Layout/Layout'
import { Routes } from '~/routes'

export default function SignUpPage() {
  return (
    <Layout>
      <Center>
        <SignUp redirectUrl={Routes.rooms} signInUrl={Routes.signIn} />
      </Center>
    </Layout>
  )
}

import { SignUp } from '@clerk/nextjs'

import { Center } from '~/components/Center/Center'
import { Layout } from '~/components/Layout/Layout'
import { Routes } from '~/routes'

export default function SignUpPage() {
  return (
    <Layout>
      <Center>
        <SignUp path={Routes.signUp} redirectUrl={Routes.rooms} routing="path" signInUrl={Routes.home} />
      </Center>
    </Layout>
  )
}

import { SignIn } from '@clerk/nextjs'

import { Center } from '~/components/Center/Center'
import { Layout } from '~/components/Layout/Layout'
import { Routes } from '~/routes'

export default function Home() {
  return (
    <Layout>
      <Center>
        <SignIn path={Routes.home} redirectUrl={Routes.rooms} routing="path" signUpUrl={Routes.signUp} />
      </Center>
    </Layout>
  )
}

import { SignIn } from '@clerk/nextjs'

import { Center } from '~/components/Center/Center'
import { Layout } from '~/components/Layout/Layout'

export default function SignInPage() {
  return (
    <Layout>
      <Center>
        <SignIn />
      </Center>
    </Layout>
  )
}

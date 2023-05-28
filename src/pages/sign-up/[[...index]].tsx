import { SignUp } from '@clerk/nextjs'

import { Center } from '~/components/Center/Center'
import { Layout } from '~/components/Layout/Layout'

export default function SignUpPage() {
  return (
    <Layout>
      <Center>
        <SignUp />
      </Center>
    </Layout>
  )
}

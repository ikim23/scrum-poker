import { SignUp } from '@clerk/nextjs'

import { Center } from '~/components/Center/Center'
import { Routes } from '~/routes'

export default function SignUpPage() {
  return (
    <Center>
      <SignUp path={Routes.signUp} redirectUrl={Routes.rooms} routing="path" signInUrl={Routes.home} />
    </Center>
  )
}

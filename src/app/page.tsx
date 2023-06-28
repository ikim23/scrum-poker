import { SignIn } from '@clerk/nextjs'

import { Center } from '~/components/Center'
import { Routes } from '~/routes'

export default function HomePage() {
  return (
    <Center>
      <SignIn path={Routes.home} redirectUrl={Routes.rooms} routing="path" signUpUrl={Routes.signUp} />
    </Center>
  )
}

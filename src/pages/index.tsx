import Link from 'next/link'

import { Button } from '~/components/Button/Button'
import { Center } from '~/components/Center/Center'
import { Layout } from '~/components/Layout/Layout'

export default function Home() {
  return (
    <Layout>
      <Center>
        <Link href="/sign-in">
          <Button>Sign in</Button>
        </Link>
      </Center>
    </Layout>
  )
}

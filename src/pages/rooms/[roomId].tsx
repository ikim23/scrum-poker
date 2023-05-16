import { Card } from '~/components/Card/Card'
import { Layout } from '~/components/Layout/Layout'

const VALUES = ['1', '2', '3', '5', '8', '13', '20', '40', '100']

export default function Room() {
  return (
    <Layout>
      <div className="flex">
        <div className="inline-grid grid-cols-3 gap-4">
          {VALUES.map((value) => (
            <Card key={value} value={value} onClick={() => {}} />
          ))}
        </div>
        <div className="ml-auto">
          <h2 className="mb-4 text-3xl">Connected Users</h2>
          <ul>
            <li>John</li>
            <li>Pete</li>
            <li>Becky</li>
          </ul>
        </div>
      </div>
    </Layout>
  )
}

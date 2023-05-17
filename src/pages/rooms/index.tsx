import { useState } from 'react'

import { Button } from '~/components/Button/Button'
import { Layout } from '~/components/Layout/Layout'
import { RoomList } from '~/components/RoomList/RoomList'
import { Spinner } from '~/components/Spinner/Spinner'
import { trpc } from '~/utils/trpc'

export default function Rooms() {
  const [roomName, setRoomName] = useState('')
  const rooms = trpc.room.getRooms.useQuery()
  const createRoom = trpc.room.createRoom.useMutation({
    onSuccess: () => {
      setRoomName('')
      void rooms.refetch()
    },
  })

  return (
    <Layout>
      <h1 className="mb-4 text-3xl">Your Rooms</h1>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          createRoom.mutate({ name: roomName })
        }}
      >
        <input
          className="mr-2 rounded text-black"
          maxLength={64}
          minLength={3}
          onChange={(event) => {
            setRoomName(event.target.value)
          }}
          type="text"
          value={roomName}
        />
        <Button className="mb-4" isDisabled={!roomName} type="submit">
          Create Room
        </Button>
      </form>
      {rooms.isLoading && <Spinner />}
      {rooms.isSuccess && <RoomList rooms={rooms.data} />}
    </Layout>
  )
}

'use client'
import { useState } from 'react'

import { Button } from '~/components/Button'
import { Spinner } from '~/components/Spinner'
import { trpc } from '~/utils/trpc'

import { RoomList, TEMP_PREFIX } from './RoomList'

export default function Rooms() {
  const [roomName, setRoomName] = useState('')
  const trpcContext = trpc.useContext()
  const rooms = trpc.room.getRooms.useQuery()
  const createRoom = trpc.room.createRoom.useMutation({
    onError(error, variables, context) {
      trpcContext.room.getRooms.setData(
        undefined,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
        () => (context as any).previousData
      )
    },
    async onMutate({ name }) {
      await trpcContext.room.getRooms.cancel()

      const previousData = trpcContext.room.getRooms.getData()

      setRoomName('')
      trpcContext.room.getRooms.setData(undefined, (previousRooms) =>
        previousRooms ? [...previousRooms, { name, roomId: `${TEMP_PREFIX}-${Date.now()}` }] : undefined
      )

      return { previousData }
    },
    onSettled() {
      void trpcContext.room.getRooms.invalidate()
    },
  })

  return (
    <>
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
    </>
  )
}

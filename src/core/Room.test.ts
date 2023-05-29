import { expect, test } from 'vitest'

import Room from './Room'
import User from './User'

test('User connects to the room', () => {
  const ownerId = 'owner'
  const room = Room.create({ name: 'Room 1', ownerId, roomId: 'room1' })

  room.connect(ownerId)

  expect(room.getUsers()).have.lengthOf(1)
})

test('User cannot be in the room twice', () => {
  const ownerId = 'owner'
  const room = Room.create({ name: 'Room 1', ownerId, roomId: 'room1' })

  room.connect(ownerId)
  room.connect(ownerId)

  expect(room.getUsers()).have.lengthOf(1)
})

test('User disconnects from the room', () => {
  const ownerId = 'owner'
  const room = Room.create({ name: 'Room 1', ownerId, roomId: 'room1' })

  room.connect(ownerId)

  expect(room.getUsers()).have.lengthOf(1)

  room.disconnect(ownerId)

  expect(room.getUsers()).have.lengthOf(0)
})

test('Vote is stored', () => {
  const ownerId = 'owner'
  const room = Room.create({ name: 'Room 1', ownerId, roomId: 'room1' })
  room.connect(ownerId)

  room.vote(ownerId, '3')

  expect(room.getVotes()).toHaveProperty(ownerId, '3')
})

test('Finish returns average', () => {
  const ownerId = 'owner'
  const user1 = 'user1'
  const room = Room.create({ name: 'Room 1', ownerId, roomId: 'room1' })
  room.connect(ownerId)
  room.connect(user1)

  room.vote(ownerId, '1')
  room.vote(user1, '2')
  room.finish(ownerId)

  expect(room.getResult()).toEqual(1.5)
})

test('Reset clears votes', () => {
  const ownerId = 'owner'
  const user1 = 'user1'
  const room = Room.create({ name: 'Room 1', ownerId, roomId: 'room1' })
  room.connect(ownerId)
  room.connect(user1)

  room.vote(ownerId, '1')
  room.vote(user1, '2')

  expect(room.getVotes()).toHaveProperty(ownerId, '1')
  expect(room.getVotes()).toHaveProperty(user1, '2')

  room.reset(ownerId)

  expect(room.getVotes()).not.toHaveProperty(ownerId)
  expect(room.getVotes()).not.toHaveProperty(user1)
})

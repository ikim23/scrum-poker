import { ALLOWED_VOTES, type Vote } from './Vote'

export default class Room {
  static create({ name, ownerId, roomId }: { name: string; ownerId: string; roomId: string }): Room {
    return new Room(roomId, ownerId, name)
  }

  private readonly users = new Set<string>()
  private votes: Record<string, Vote> = {}
  private result: number | null = null

  private constructor(readonly roomId: string, readonly ownerId: string, readonly name: string) {}

  getUsers() {
    return Array.from(this.users)
  }

  getVotes() {
    return Object.assign({}, this.votes)
  }

  getResult() {
    return this.result
  }

  connect(userId: string) {
    this.users.add(userId)
  }

  disconnect(userId: string) {
    this.users.delete(userId)
  }

  vote(userId: string, vote: Vote) {
    if (!this.users.has(userId)) {
      throw new Error(`User ${userId} is not allowed to vote`)
    }
    if (!ALLOWED_VOTES.includes(vote)) {
      throw new Error(`${vote} is not allowed vote`)
    }

    this.votes[userId] = vote
  }

  finish(userId: string) {
    if (userId !== this.ownerId) {
      throw new Error('Only the room owner is allowed to finish voting')
    }

    const votes = Object.values(this.votes)
    const sumVotes = votes.reduce((sum, vote) => sum + Number(vote), 0)
    this.result = sumVotes / votes.length

    return this.result
  }

  reset(userId: string) {
    if (userId !== this.ownerId) {
      throw new Error('Only the room owner is allowed to reset voting')
    }

    this.votes = {}
    this.result = null
  }
}

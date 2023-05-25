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
    return this.votes
  }

  getResult() {
    return this.result
  }

  get usersWithVotes() {
    return Object.keys(this.votes)
  }

  canConnect(userId: string) {
    return !this.users.has(userId)
  }

  connect(userId: string) {
    if (!this.canConnect(userId)) {
      throw new Error()
    }

    this.users.add(userId)
  }

  canDisconnect(userId: string) {
    return this.users.has(userId)
  }

  disconnect(userId: string) {
    if (!this.canDisconnect(userId)) {
      throw new Error()
    }

    this.users.delete(userId)
  }

  vote(userId: string, vote: Vote) {
    if (!this.users.has(userId)) {
      throw new Error()
    }
    if (!ALLOWED_VOTES.includes(vote)) {
      throw new Error()
    }

    this.votes[userId] = vote
  }

  finish(userId: string) {
    if (userId !== this.ownerId) {
      throw new Error()
    }

    const votes = Object.values(this.votes)
    const sumVotes = votes.reduce((sum, vote) => sum + Number(vote), 0)
    this.result = sumVotes / votes.length

    return this.result
  }

  reset(userId: string) {
    if (userId !== this.ownerId) {
      throw new Error()
    }

    this.votes = {}
    this.result = null
  }
}

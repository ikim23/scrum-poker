import type User from './User'
import { ALLOWED_VOTES, type Vote } from './Vote'

export default class Room {
  static create({ name, owner, roomId }: { name: string; owner: User; roomId: string }): Room {
    return new Room(roomId, owner, name)
  }

  private readonly users: Record<string, User> = {}
  private votes: Record<string, Vote> = {}

  private constructor(readonly roomId: string, readonly owner: User, readonly name: string) {
    this.connect(owner)
  }

  get connectedUsers() {
    return Object.values(this.users)
  }

  canConnect(user: User) {
    return !this.hasUser(user)
  }

  connect(user: User) {
    if (!this.canConnect(user)) {
      throw new Error()
    }

    this.users[user.userId] = user
  }

  canDisconnect(user: User) {
    return this.hasUser(user)
  }

  disconnect(user: User) {
    if (!this.canDisconnect(user)) {
      throw new Error()
    }

    delete this.users[user.userId]
  }

  vote(user: User, vote: Vote) {
    if (!ALLOWED_VOTES.includes(vote)) {
      throw new Error()
    }

    this.votes[user.userId] = vote
  }

  hasAllVotes() {
    return this.usersCount === this.votesCount
  }

  getVoteAverage() {
    if (!this.hasAllVotes()) {
      throw new Error()
    }

    const sumVotes = Object.values(this.votes).reduce((sum, vote) => sum + vote, 0)

    return sumVotes / this.usersCount
  }

  private hasUser(user: User) {
    return Boolean(this.users[user.userId])
  }

  private get usersCount() {
    return Object.keys(this.users).length
  }

  private get votesCount() {
    return Object.keys(this.votes).length
  }
}

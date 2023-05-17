export default class User {
  static create({ id, name }: { id: string; name: string }): User {
    return new User(id, name)
  }

  private constructor(readonly userId: string, readonly name: string) {}
}

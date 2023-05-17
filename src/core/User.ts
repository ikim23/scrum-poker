export default class User {
  static create({ email, id, image, name }: { email: string; id: string; image: string; name: string }): User {
    return new User(id, email, name, image)
  }

  private constructor(readonly userId: string, readonly email: string, readonly name: string, readonly image: string) {}
}

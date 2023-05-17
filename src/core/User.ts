export default class User {
  static create({ email, image, name }: { email: string; image: string; name: string }): User {
    return new User(email, email, name, image)
  }

  private constructor(readonly userId: string, readonly email: string, readonly name: string, readonly image: string) {}
}

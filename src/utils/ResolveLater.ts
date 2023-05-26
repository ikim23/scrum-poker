type LaterCallback<T> = (value: T) => void

export default class ResolveLater<T> {
  private readonly callbacks: LaterCallback<T>[] = []
  private value: T | null = null

  setOnce(value: T) {
    if (this.value) {
      throw new Error('Value was already set')
    }

    this.value = value

    while (this.callbacks.length > 0) {
      const callback = this.callbacks.pop()
      callback?.(this.value)
    }
  }

  resolve(callback: LaterCallback<T>) {
    if (this.value) {
      return callback(this.value)
    }

    this.callbacks.push(callback)
  }
}

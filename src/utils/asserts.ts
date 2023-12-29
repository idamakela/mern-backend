export function assertDefine<T>(value: T): asserts value is NonNullable<T> {
  if (value === undefined || value === null) {
    throw Error(`Expected value to be defined, but got: ${value}`)
  }
}

export default class Address {
  private address: string

  constructor(addressInput: string) {
    this.address = addressInput
  }

  toJson(): string {
    return this.address
  }
}

export default class Address {
  private address: string

  constructor(addressInput: string) {
    this.address = addressInput
  }

  toJson(): object {
    return { address: this.address }
  }
}

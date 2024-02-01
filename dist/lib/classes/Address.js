export default class Address {
    constructor(addressInput) {
        this.address = addressInput;
    }
    toJson() {
        return { address: this.address };
    }
}

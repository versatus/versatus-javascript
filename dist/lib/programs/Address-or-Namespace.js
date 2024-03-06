export default class Address {
    constructor(addressInput) {
        this.address = addressInput;
    }
    toJson() {
        return this.address;
    }
}
export class Namespace {
    constructor(namespace) {
        this.namespace = namespace;
    }
    toJson() {
        return { namespace: this.namespace };
    }
}

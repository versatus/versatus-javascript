export class Address {
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
export class AddressOrNamespace {
    constructor(value) {
        this.value = value;
    }
    toJson() {
        if ((typeof this.value !== 'string' &&
            this.value.toJson() === AddressOrNamespace.THIS) ||
            this.value === AddressOrNamespace.THIS) {
            return 'this';
        }
        else if (this.value instanceof Address) {
            return { address: this.value.toJson() };
        }
        else if (this.value instanceof Namespace) {
            return { namespace: this.value.toJson() };
        }
        else {
            return this.value;
        }
    }
}
AddressOrNamespace.THIS = 'this';
export class Credit {
    constructor(value) {
        this.value = value;
    }
    toJson() {
        return { credit: this.value };
    }
}
export class Debit {
    constructor(value) {
        this.value = value;
    }
    toJson() {
        return { debit: this.value };
    }
}
export class BalanceValue {
    constructor(value) {
        this.value = value;
    }
    toJson() {
        return { balance: this.value };
    }
}

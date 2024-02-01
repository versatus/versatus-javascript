export class AddressOrNamespace {
    constructor(value) {
        this.value = value;
    }
    toJson() {
        if (this.value === AddressOrNamespace.THIS) {
            return 'this';
        }
        else {
            return this.value.toJson();
        }
    }
}
AddressOrNamespace.THIS = 'this';
export class Credit {
    constructor(value) {
        this.value = value;
    }
    toJson() {
        return { credit: this.value.toHex() };
    }
}
export class Debit {
    constructor(value) {
        this.value = value;
    }
    toJson() {
        return { debit: this.value.toHex() };
    }
}
export class BalanceValue {
    constructor(value) {
        this.value = value;
    }
    toJson() {
        return { balance: this.value.toJson() };
    }
}
export class StatusValue {
    constructor(value) {
        this.value = value;
    }
    toJson() {
        return { statusValue: this.value };
    }
}
export class TokenOrProgramUpdate {
    constructor(kind, value) {
        this.kind = kind;
        this.value = value;
    }
    toJson() {
        return { [this.kind]: this.value.toJson() };
    }
}

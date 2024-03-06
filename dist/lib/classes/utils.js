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

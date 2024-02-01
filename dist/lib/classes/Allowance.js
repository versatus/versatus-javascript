export class AllowanceInsert {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }
    toJson() {
        return { insert: [this.key.toJson(), this.value.toJson()] };
    }
}
export class AllowanceExtend {
    constructor(items) {
        this.items = items;
    }
    toJson() {
        return {
            extend: this.items.map((item) => [item[0].toJson(), item[1].toJson()]),
        };
    }
}
export class AllowanceRemove {
    constructor(key, items) {
        this.key = key;
        this.items = items;
    }
    toJson() {
        return {
            remove: [this.key.toJson(), this.items.map((inner) => inner.toJson())],
        };
    }
}
export class AllowanceRevoke {
    constructor(key) {
        this.key = key;
    }
    toJson() {
        return { revoke: this.key.toJson() };
    }
}
export class AllowanceValue {
    constructor(value) {
        this.value = value;
    }
    toJson() {
        return { allowance: this.value.toJson() };
    }
}

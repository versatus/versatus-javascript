export class ApprovalsInsert {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }
    toJson() {
        return {
            insert: [this.key.toJson(), this.value.map((inner) => inner)],
        };
    }
}
export class ApprovalsExtend {
    constructor(items) {
        this.items = items;
    }
    toJson() {
        return {
            extend: this.items.map((item) => [item[0].toJson(), item[1]]),
        };
    }
}
export class ApprovalsRemove {
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
export class ApprovalsRevoke {
    constructor(key) {
        this.key = key;
    }
    toJson() {
        return { revoke: this.key.toJson() };
    }
}
export class ApprovalsValue {
    constructor(value) {
        this.value = value;
    }
    toJson() {
        return { approvals: this.value.toJson() };
    }
}

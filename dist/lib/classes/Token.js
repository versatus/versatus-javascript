export class TokenMetadataInsert {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }
    toJson() {
        return { insert: [this.key, this.value] };
    }
}
export class TokenMetadataExtend {
    constructor(map) {
        this.map = map;
    }
    toJson() {
        return { extend: this.map };
    }
}
export class TokenMetadataRemove {
    constructor(key) {
        this.key = key;
    }
    toJson() {
        return { remove: this.key };
    }
}
export class TokenMetadataValue {
    constructor(value) {
        this.value = value;
    }
    toJson() {
        return { metadata: this.value.toJson() };
    }
}
export class TokenIdPush {
    constructor(value) {
        this.value = value;
    }
    toJson() {
        return { push: this.value.toString() };
    }
}
export class TokenIdExtend {
    constructor(items) {
        this.items = items;
    }
    toJson() {
        return { extend: this.items.map((item) => item.toString()) };
    }
}
export class TokenIdInsert {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }
    toJson() {
        return { insert: [this.key, this.value.toString()] };
    }
}
export class TokenIdPop {
    toJson() {
        return { pop: {} };
    }
}
export class TokenIdRemove {
    constructor(key) {
        this.key = key;
    }
    toJson() {
        return { remove: this.key.toString() };
    }
}
export class TokenIdValue {
    constructor(value) {
        this.value = value;
    }
    toJson() {
        return { tokenIds: this.value.toJson() };
    }
}
export class TokenDataInsert {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }
    toJson() {
        return { insert: [this.key, this.value] };
    }
}
export class TokenDataExtend {
    constructor(map) {
        this.map = map;
    }
    toJson() {
        return { extend: this.map };
    }
}
export class TokenDataRemove {
    constructor(key) {
        this.key = key;
    }
    toJson() {
        return { remove: this.key };
    }
}
export class TokenDataValue {
    constructor(value) {
        this.value = value;
    }
    toJson() {
        return { data: this.value.toJson() };
    }
}
export class TokenFieldValue {
    constructor(kind, value) {
        this.kind = kind;
        this.value = value;
    }
    toJson() {
        return { [this.kind]: this.value.toJson() };
    }
}
export class TokenField {
    constructor(value) {
        this.value = value;
    }
    toJson() {
        return this.value;
    }
}
export class TokenUpdateField {
    constructor(field, value) {
        this.field = field;
        this.value = value;
    }
    toJson() {
        return {
            field: this.field.toJson(),
            value: this.value.toJson(),
        };
    }
}
export class TokenUpdate {
    constructor(account, token, updates) {
        this.account = account;
        this.token = token;
        this.updates = updates;
    }
    toJson() {
        return {
            account: this.account ?? null,
            token: this.token ?? null,
            updates: this.updates.map((update) => update),
        };
    }
}
export class TokenDistribution {
    constructor(programId, to, amount, tokenIds, updateFields) {
        this.programId = programId;
        this.to = to;
        this.amount = amount;
        this.tokenIds = tokenIds;
        this.updateFields = updateFields;
    }
    toJson() {
        return {
            programId: this.programId,
            to: this.to,
            amount: this.amount === null ? null : this.amount,
            tokenIds: this.tokenIds.map((item) => item),
            updateFields: this.updateFields.map((field) => field),
        };
    }
}

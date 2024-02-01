export class LinkedProgramsInsert {
    constructor(key) {
        this.key = key;
    }
    toJson() {
        return { insert: this.key.toJson() };
    }
}
export class LinkedProgramsExtend {
    constructor(items) {
        this.items = items;
    }
    toJson() {
        return { extend: this.items.map((item) => item.toJson()) };
    }
}
export class LinkedProgramsRemove {
    constructor(key) {
        this.key = key;
    }
    toJson() {
        return { remove: this.key.toJson() };
    }
}
export class LinkedProgramsValue {
    constructor(value) {
        this.value = value;
    }
    toJson() {
        return { linkedPrograms: { linkedProgramValue: this.value.toJson() } };
    }
}
export class ProgramMetadataInsert {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }
    toJson() {
        return { insert: [this.key, this.value] };
    }
}
export class ProgramMetadataExtend {
    constructor(map) {
        this.map = map;
    }
    toJson() {
        return { extend: this.map };
    }
}
export class ProgramMetadataRemove {
    constructor(key) {
        this.key = key;
    }
    toJson() {
        return { remove: this.key };
    }
}
export class ProgramMetadataValue {
    constructor(value) {
        this.value = value;
    }
    toJson() {
        return { metadata: this.value.toJson() };
    }
}
export class ProgramDataInsert {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }
    toJson() {
        return { insert: [this.key, this.value] };
    }
}
export class ProgramDataExtend {
    constructor(map) {
        this.map = map;
    }
    toJson() {
        return { extend: this.map };
    }
}
export class ProgramDataRemove {
    constructor(key) {
        this.key = key;
    }
    toJson() {
        return { remove: this.key };
    }
}
export class ProgramDataValue {
    constructor(value) {
        this.value = value;
    }
    toJson() {
        return { data: this.value.toJson() };
    }
}
export class ProgramFieldValue {
    constructor(kind, value) {
        this.kind = kind;
        this.value = value;
    }
    toJson() {
        return { [this.kind]: this.value.toJson() };
    }
}
export class ProgramField {
    constructor(value) {
        this.value = value;
    }
    toJson() {
        return this.value;
    }
}
export class ProgramUpdateField {
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
export class ProgramUpdate {
    constructor(account, updates) {
        this.account = account;
        this.updates = updates;
    }
    toJson() {
        return {
            account: this.account.toJson(),
            updates: this.updates.map((update) => update.toJson()),
        };
    }
}

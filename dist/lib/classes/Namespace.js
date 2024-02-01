export class Namespace {
    constructor(namespace) {
        this.namespace = namespace;
    }
    toJson() {
        return { namespace: this.namespace };
    }
}

export class Namespace {
  private namespace: string

  constructor(namespace: string) {
    this.namespace = namespace
  }

  toJson(): object {
    return { namespace: this.namespace }
  }
}

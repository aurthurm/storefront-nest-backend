export default class BotMenuBuilder {
  constructor(
    private title: string,
    private options: string[],
    private current: string,
    private next: string,
    private previous: string,
    private validation: string,
    private validationResponse: string,
    private expectedResponses: any[],
  ) {}

  addOption(option: string): void {
    this.options.push(option);
  }

  set Title(title: string) {
    this.title = title;
  }

  get Title(): string {
    return this.title;
  }

  set Next(value: string) {
    this.next = value;
  }

  get Next(): string {
    return this.next;
  }

  set Previous(value: string) {
    this.previous = value;
  }

  get Previous(): string {
    return this.previous;
  }

  set Current(value: string) {
    this.current = value;
  }

  get Current(): string {
    return this.current;
  }

  get Validation(): string {
    return this.validation;
  }

  get ValidationResponse(): string {
    return this.validationResponse;
  }

  get ExpectedResponses(): any[] {
    return this.expectedResponses;
  }

  build(): string {
    return this.title + ' \n' + this.options.join(' \n');
  }

  get() {
    return this;
  }
}

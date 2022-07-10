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
    private isValidResponse: boolean = true,
    private action: any = function (action) {
      action;
    },
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

  setIsValidResponse(isValid: boolean) {
    this.isValidResponse = isValid;
    return this;
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

  setAction(action: any) {
    this.action = action;
    return this;
  }

  get Action(): any {
    return this.action;
  }

  exec() {
    this.action();
    return this;
  }

  build(): string {
    return (
      this.title +
      ' \n' +
      this.options.join(' \n') +
      ' \n' +
      ((!this.isValidResponse ? this.validationResponse : '') ?? '')
    );
  }

  get() {
    return this;
  }
}

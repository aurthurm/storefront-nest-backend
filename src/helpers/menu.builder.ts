import { IBotActionResponse } from 'src/models/bot_action.model';

export default class BotMenuBuilder {
  constructor(
    private title: string,
    private options: string[],
    private previous: string,
    private current: string,
    private next: string,
    private validation: RegExp,
    private validationResponse: string,
    private expectedResponses: any[],
    private isValidResponse: boolean = true,
    private action: any = function (action) {
      return action;
    },
  ) {}

  addOption(option: string): void {
    this.options.push(option);
  }

  setTitle(title: string) {
    this.title = title;
    return this;
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

  setIsValidResponse(isValid: boolean) {
    this.isValidResponse = isValid;
    return this;
  }

  set Current(value: string) {
    this.current = value;
  }

  get Current(): string {
    return this.current;
  }

  get Validation(): RegExp {
    return this.validation;
  }

  get ValidationResponse(): string {
    return this.validationResponse;
  }

  setValidationResponse(value: string) {
    this.validationResponse = value;
    return this;
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

  exec(value: any): IBotActionResponse {
    return this.action(value);
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

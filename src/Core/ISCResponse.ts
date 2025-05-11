import { CommunicationProtocol } from './CommunicationProtocol';
import { Constants } from './Utils/Constants';

export class ISCResponse extends CommunicationProtocol {
  constructor (iscResponse: CommunicationProtocol) {
    super(iscResponse);
    this.headers[Constants.status] = '';
    this.headers[Constants.statusCode] = '';
    this.headers[Constants.message] = '';
  }

  public get Status (): string {
    return this.headers[Constants.status] as string;
  }

  public set Status (value: string) {
    this.headers[Constants.status] = value;
  }

  public get StatusCode (): string {
    return this.headers[Constants.statusCode] as string;
  }

  public set StatusCode (value: string) {
    this.headers[Constants.statusCode] = value;
  }

  public get Message (): string {
    return this.headers[Constants.message] as string;
  }

  public set Message (value: string) {
    this.headers[Constants.message] = value;
  }
}

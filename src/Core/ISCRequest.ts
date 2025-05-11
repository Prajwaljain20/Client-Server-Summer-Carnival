import { CommunicationProtocol } from './CommunicationProtocol';

export class ISCRequest extends CommunicationProtocol {
  constructor (iscRequest: CommunicationProtocol) {
    super(iscRequest);
  }
}

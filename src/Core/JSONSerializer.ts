import { CommunicationProtocol } from './CommunicationProtocol';
import { DataSerializer } from './models/DataSerializer.interface';

export class JSONSerializer implements DataSerializer {

  public serialize (protocol: CommunicationProtocol): string {
    return JSON.stringify(protocol);
  }

  public deserialize (data: string): CommunicationProtocol {
    return JSON.parse(data) as CommunicationProtocol;
  }
}

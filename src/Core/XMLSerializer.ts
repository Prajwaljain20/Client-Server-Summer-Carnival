import { CommunicationProtocol } from './CommunicationProtocol';
import { DataSerializer } from './models/DataSerializer.interface';

export class XMLSerializer implements DataSerializer {

  public serialize(protocol: CommunicationProtocol): string {
    return '';
  }

  public deserialize(data: string): CommunicationProtocol {
    return JSON.parse(data) as CommunicationProtocol;
  }
}
import { CommunicationProtocol } from '../CommunicationProtocol';

export interface DataSerializer {
    serialize (protocol: CommunicationProtocol): string;
    deserialize (data: string): CommunicationProtocol;
}

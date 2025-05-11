import { Headers } from './models/Headers.interface';

export class CommunicationProtocol {
  data: Uint8Array;
  format: string;
  headers: Headers;
  outputFilePath?: string;
  id?: number;

  constructor (data: CommunicationProtocol) {
    this.data = data.data;
    this.format = data.format;
    this.headers = data.headers;
    this.outputFilePath = data.outputFilePath;
    this.id = data.id
  }
}

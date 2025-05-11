import { Format } from './enums/Format.enum';
import { JSONSerializer } from './JSONSerializer';
import { XMLSerializer } from './XMLSerializer';
import { DataSerializer } from './models/DataSerializer.interface';

export class DataSerializerFactory {
  public static getSerializer (format: string): DataSerializer {
    if (format.toLowerCase() === Format.JSON) {
      return new JSONSerializer();
    } else if (format.toLowerCase() === Format.XML) {
      return new XMLSerializer();
    } else {
      throw new Error(Format.UNSUPPORTED);
    }
  }
}

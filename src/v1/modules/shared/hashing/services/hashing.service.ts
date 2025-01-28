import * as cryptojs from 'crypto-js';

export interface IHashingService {
  hashSha256(data: string): string;
}
export class HashingService implements IHashingService {
  hashSha256(data: string): string {
    const hash = cryptojs.SHA256(data).toString();
    return hash;
  }
}

export interface IAccountVerification {
  id: string;
  userId: string;
  emailToken: string;
  phoneCode: string;
  expiresAt: Date;
  used: boolean;
  isExpired(): boolean;
  isUsed(): boolean;
}

export class AccountVerification {
  id: string;
  userId: string;
  emailToken: string;
  phoneCode: string;
  expiresAt: Date;
  used: boolean;
  isExpired(): boolean {
    return new Date(this.expiresAt) >= new Date();
  }
  isUsed(): boolean {
    return this.used;
  }
}

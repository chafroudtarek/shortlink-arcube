export interface ICreateAccountVerificationDto {
  userId: string;
  emailToken?: string;
  phoneCode?: string;
  expiresAt: Date;
  used?: boolean;
}

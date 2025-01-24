export class AuthResponse {
  acces_token: string;
  expires_in: number;

  constructor(acces_token: string, expires_in: number) {
    this.acces_token = acces_token;
    this.expires_in = expires_in;
  }
}

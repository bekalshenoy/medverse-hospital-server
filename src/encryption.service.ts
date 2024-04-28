import { Injectable } from "@nestjs/common";
import { createCipheriv, pbkdf2Sync, randomBytes } from "crypto";
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

@Injectable()
export class EncryptionService {
  private salt: string = process.env.SALT;

  generateIv(): Buffer {
    return randomBytes(16);
  }

  getKeyFromPassword(password: string): Buffer {
    return pbkdf2Sync(password, this.salt, 65536, 256, "sha256");
  }

  encrypt(input: string, key: Buffer, iv: Buffer): string {
    const cipher = createCipheriv("aes-256-cbc", key, iv);
    let encrypted = cipher.update(input);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString("hex");
  }

  decrypt(input: string, key: Buffer, iv: Buffer): string {
    const encryptedText = Buffer.from(input, "hex");
    const decipher = createCipheriv("aes-256-cbc", key, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
}

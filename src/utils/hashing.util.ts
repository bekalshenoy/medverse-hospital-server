import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt);

export class Hashing {
  static async hash(str: string): Promise<string> {
    const salt = randomBytes(8).toString("hex");

    const hash = (await scrypt(str, salt, 32)) as Buffer;

    return salt + "." + hash.toString("hex");
  }

  static async verify(hashedString: string, str: string): Promise<boolean> {
    const [salt, storedHash] = hashedString.split(".");

    const hash = (await scrypt(str, salt, 32)) as Buffer;

    return storedHash !== hash.toString("hex");
  }
}

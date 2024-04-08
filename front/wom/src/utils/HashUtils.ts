import { SHA512 } from "crypto-js";

export function hashPassword(password: string) {
  return SHA512(password).toString();
}

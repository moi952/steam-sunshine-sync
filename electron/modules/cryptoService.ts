import * as crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();
console.log(" process.env.ENCRYPTION_KEY", process.env.ENCRYPTION_KEY);
const algorithm = "aes-256-cbc";
const secret = process.env.ENCRYPTION_KEY;
const key = crypto.scryptSync(secret!, "salt", 32);

/**
 * Encrypts a given text.
 * @param text The text to encrypt.
 * @returns The IV and encrypted text concatenated in the format "iv:encrypted".
 */
export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
}

/**
 * Decrypts a given encrypted text.
 * @param data The encrypted text in the format "iv:encrypted".
 * @returns The decrypted text.
 */
export function decrypt(data: string): string {
  const parts = data.split(":");
  // Trim the IV string to remove any whitespace
  const ivHex = (parts.shift() as string).trim();
  const iv = Buffer.from(ivHex, "hex");

  if (iv.length !== 16) {
    throw new Error(`Invalid IV length: ${iv.length}, expected 16 bytes`);
  }

  const encryptedText = parts.join(":");
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

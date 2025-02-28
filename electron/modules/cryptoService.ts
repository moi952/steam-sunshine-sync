import * as crypto from "crypto";
// eslint-disable-next-line import/no-extraneous-dependencies
import { app } from "electron";

const algorithm = "aes-256-cbc";
let key: Buffer;

function initializeKey() {
  const secret = process.env.ENCRYPTION_KEY;
  if (!secret) {
    console.error("ENCRYPTION_KEY is not set! The app will exit.");
    process.exit(1);
  }
  key = crypto.scryptSync(secret, "salt", 32);
}

// Initialize the key once the app is ready
app.whenReady().then(() => {
  initializeKey();
});

/**
 * Encrypts a given text.
 * @param text The text to encrypt.
 * @returns The IV and encrypted text concatenated in the format "iv:encrypted".
 */
export function encrypt(text: string): string {
  if (!key) throw new Error("Encryption key not initialized");
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
  if (!key) throw new Error("Encryption key not initialized");
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

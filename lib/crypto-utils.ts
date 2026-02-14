import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_API_ENCRYPTION_KEY || "";
const IV = process.env.NEXT_PUBLIC_API_ENCRYPTION_IV || "";

export const encryptData = (data: any): string => {
  if (!data) return "";
  const jsonStr = typeof data === 'string' ? data : JSON.stringify(data);
  const encrypted = CryptoJS.AES.encrypt(
    jsonStr,
    CryptoJS.enc.Utf8.parse(ENCRYPTION_KEY),
    {
      iv: CryptoJS.enc.Utf8.parse(IV),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }
  );
  return encrypted.toString();
};

export const decryptData = (encryptedData: string): any => {
  if (!encryptedData) return null;
  try {
    const bytes = CryptoJS.AES.decrypt(
      encryptedData,
      CryptoJS.enc.Utf8.parse(ENCRYPTION_KEY),
      {
        iv: CryptoJS.enc.Utf8.parse(IV),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    );
    const decryptedStr = bytes.toString(CryptoJS.enc.Utf8);
    try {
      return JSON.parse(decryptedStr);
    } catch {
      return decryptedStr;
    }
  } catch (error) {
    console.error('Decryption failed:', error);
    return null;
  }
};

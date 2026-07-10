/**
 * AES-256-GCM encryption/decryption using Web Crypto API
 */

const PASS_PHRASE = 'lendswift-form-draft-key-2024';

const getKey = async (): Promise<CryptoKey> => {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(PASS_PHRASE.padEnd(32, '0').slice(0, 32)),
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
  return keyMaterial;
};

export const encryptData = async (data: string): Promise<string> => {
  try {
    const key = await getKey();
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const enc = new TextEncoder();
    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      enc.encode(data)
    );
    const combined = new Uint8Array(iv.byteLength + encrypted.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), iv.byteLength);
    return btoa(String.fromCharCode(...combined));
  } catch {
    return btoa(data); // Fallback
  }
};

export const decryptData = async (encryptedBase64: string): Promise<string> => {
  try {
    const key = await getKey();
    const combined = Uint8Array.from(atob(encryptedBase64), (c) => c.charCodeAt(0));
    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);
    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encrypted
    );
    return new TextDecoder().decode(decrypted);
  } catch {
    try {
      return atob(encryptedBase64);
    } catch {
      return '';
    }
  }
};

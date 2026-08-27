const SIGNATURES: { mimeType: string; matches: (bytes: Buffer) => boolean }[] = [
  {
    mimeType: 'image/jpeg',
    matches: (bytes) => bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
  },
  {
    mimeType: 'image/png',
    matches: (bytes) =>
      bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  },
  {
    mimeType: 'image/webp',
    matches: (bytes) =>
      bytes.subarray(0, 4).toString('ascii') === 'RIFF' &&
      bytes.subarray(8, 12).toString('ascii') === 'WEBP'
  }
];

export const detectImageType = (bytes: Buffer): string | null =>
  SIGNATURES.find((signature) => signature.matches(bytes))?.mimeType ?? null;

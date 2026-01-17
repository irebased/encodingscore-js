
const HEX_RE = /^[0-9a-fA-F]{2}$/;
export const HEX_BYTE_CHAR_WIDTH = 2;

export function scanHex(s, validByte, validationRe) {
  const hits = new Array(s.length).fill(false);
  const cleanedString = s.replaceAll(" ", "");

  for (let i = 0; i <= cleanedString.length - 2; i++) {
    const pair = cleanedString.slice(i, i + 2);
    if (!HEX_RE.test(pair)) continue;

    try {
      const byte = parseInt(pair, 16);
      if (validByte(String.fromCharCode(byte), validationRe)) {
        hits[i] = hits[i + 1] = true;
      }
    } catch {
        // Ignores failures.
    }
  }

  return hits.filter(hit => hit === true);
}
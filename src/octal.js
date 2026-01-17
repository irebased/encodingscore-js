import { scanNumericTokens } from "./numeric.js";

const OCT_RE = /^[0-7]+$/;

export function scanOctal(s, tokens, validByte, validationRe) {
  return scanNumericTokens(s, tokens, validByte, OCT_RE, 8, validationRe);
}
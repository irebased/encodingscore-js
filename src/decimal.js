import { scanNumericTokens } from "./numeric.js";

const DEC_RE = /^[0-9]+$/;

export function scanDecimal(s, tokens, validByte, validationRe) {
  return scanNumericTokens(s, tokens, validByte, DEC_RE, 10, validationRe);
}
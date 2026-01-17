
const OCT_RE = /^[0-7]+$/;
const DEC_RE = /^[0-9]+$/;

export function scanNumericTokens(s, tokens, validByte, re, base, validationRe) {
  const spans = [];
  let offset = 0;

  for (const tok of tokens) {
    const start = s.indexOf(tok, offset);
    const end = start + tok.length;
    offset = end;

    let value;
    try {
        if (!re.test(tok)) continue;
        value = parseInt(tok, base);

        if (value >= 0 && value <= 255 && validByte(String.fromCharCode(value), validationRe)) {
            spans.push([start, end]);
        }
    } catch {}
  }

  return spans;
}
const B64_RE = /^[A-Za-z0-9+/]{4}$/;

export function scanBase64(s, validByte, re) {
  const hits = new Array(s.length).fill(false);

  for (let i = 0; i <= s.length - 4; i++) {
    const quad = s.slice(i, i + 4);
    if (!B64_RE.test(quad)) continue;

    try {
      const bin = atob(quad);
      if (bin.length !== 3) continue;

      let ok = true;
      for (let j = 0; j < 3; j++) {
        const char = bin[j]
        if (!validByte(char, re)) {
            ok = false;
            break;
        }
      }

      if (ok) {
        for (let j = i; j < i + 4; j++) hits[j] = true;
      }
    } catch {}
  }

  return hits;
}
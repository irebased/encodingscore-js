import { scanHex } from './hex.js';
import { scanBase64 } from './base64.js';
import { scanDecimal } from './decimal.js';
import { scanOctal } from './octal.js';

const supportedEncodings = [
    "base64",
    "hexadecimal",
    "octal",
    "decimal"
]

export class EncodingScorer {
    #encoding;
    #characterSetRegex;
    #regexp;

    constructor(encoding, characterSetRegex="[A-Za-z0-9\s.,!?]") {
        this.#encoding = encoding;
        this.#characterSetRegex = characterSetRegex;

        if (!this.isValidEncoding()) {
            throw new Exception(`Invalid encoding provided: ${encoding}. Must be one of: ${supportedEncodings}`);
        }

        try {
            this.#regexp = new RegExp(this.#characterSetRegex);
        } catch (e) {
            if (e instanceof SyntaxError) {
                throw new Exception(`The provided characterSet ${characterSetRegex} could not be parsed as a regex pattern.`);
            }
        }
    }

    isValidEncoding() {
        return supportedEncodings.includes(this.#encoding);
    }

    validByte(byte, re) {
        try {
            return re.test(byte);
        } catch {}
    }

    score(s) {
        switch (this.#encoding) {
            case "base64":
                return this.#scoreCounter(s, scanBase64, 4);
            case "hexadecimal":
                return this.#scoreCounter(s, scanHex, 4);
            case "decimal":
                return this.#numericScoreCounter(s, scanDecimal);
            case "octal":
                return this.#numericScoreCounter(s, scanOctal);
            default:
                throw Error(`Unsupported encoding: ${this.#encoding}.`);
        }
    }

    #scoreCounter(s, scoreFn, offset=0) {
        if (s.length <= offset) return 0;

        let hits = scoreFn(s, this.validByte, this.#regexp);
        const relevantHits = hits.slice(0, hits.length - offset);
        const count = relevantHits.filter(e => e === true).length;
        return count / (relevantHits.length);
    }

    #numericScoreCounter(s, scoreFn) {
        const tokens = s.split(/\s+/);
        const hits = scoreFn(s, tokens, this.validByte, this.#regexp)
        return hits.length / tokens.length;
    }
}
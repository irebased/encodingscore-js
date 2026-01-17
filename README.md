# EncodingScore.js

This library offers a `EncodingScorer` class which provides a score normalized between 0-1, representing how much an encoded string aligns with a provided regular expression.

## Supported Encodings

The following encodings are supported for scoring:

- Base64
- Hexadecimal
- Octal
- Decimal

## How it works

Hexadecimal and base64 work differently from octal and decimal, since base64 and hexadecimal have fixed block sizes while decimal and octal are token-based, with varying lengths to each token.

### Computing encoded n-grams

Hexadecimal and base64 strings are slid across, evaluating n-grams (bigrams for hexadecimal, tetragrams for base64) at each possible alignment. This would catch a scenario where the correct encoded text has been rotated, or prepended with an invalid character to obfuscate the text.

Octal and decimal strings are split by a space delimiter. Because of this, no sliding occurs.

### Scoring

Scoring is done based on a ratio of "hits" (n-grams that pass the regex check) to total evaluated n-grams or tokens.

For hexadecimal and base64, an "offset" is applied by removing the final *n - 1* (n=2 for hexadecimal, n=4 for base64) hit/miss results to account for the fact that the final *n - 1* hit results in the array are not going to be long enough and will therefore always miss. This is not necessary for octal and decimal, since it is a token-based system.

## Examples

Import the encoding scorer:
```js
import { EncodingScorer } from "./src/encodingScorer.js";
```

### Hexadecimal usage

```js
// Example usage for hexadecimal
const HEX_STRING = "68 65 6c 6c 6f 2e 20 74 68 69 73 20 69 73 20 61 20 6c 6f 6e 67 20 6d 65 73 73 61 67 65 20 63 6f 6e 74 61 69 6e 69 6e 67 20 61 20 6c 6f 74 20 6f 66 20 64 61 74 61 2e 20 53 6d 61 6c 6c 65 72 20 64 61 74 61 20 69 73 20 6c 65 73 73 20 70 72 65 64 69 63 74 61 62 6c 65 2e 20 50 6c 65 61 73 65 20 63 6f 6e 73 69 64 65 72 20 75 73 69 6e 67 20 6c 6f 6e 67 65 72 20 73 74 72 65 61 6d 73 20 6f 66 20 64 61 74 61 20 66 6f 72 20 61 20 68 69 67 68 65 72 20 64 65 67 72 65 65 20 6f 66 20 61 63 63 75 72 61 63 79 2e 20 54 68 61 6e 6b 73"

const NON_MATCHING_HEX = "ff ff ff ff ff ff ff ff 6d ff 6d ff"

const hexScorer = new EncodingScorer("hexadecimal");
console.log(hexScorer.score(HEX_STRING)); // 0.5899419729206963
console.log(hexScorer.score(NON_MATCHING_HEX)); // 0.12903225806451613
```
### Base64 Usage

```js
const BASE_64_STRING = "aGVsbG8uIHRoaXMgaXMgYSBsb25nIG1lc3NhZ2UgY29udGFpbmluZyBhIGxvdCBvZiBkYXRhLiBTbWFsbGVyIGRhdGEgaXMgbGVzcyBwcmVkaWN0YWJsZS4gUGxlYXNlIGNvbnNpZGVyIHVzaW5nIGxvbmdlciBzdHJlYW1zIG9mIGRhdGEgZm9yIGEgaGlnaGVyIGRlZ3JlZSBvZiBhY2N1cmFjeS4gVGhhbmtz"

const base64Scorer = new EncodingScorer("base64");
console.log(base64Scorer.score(BASE_64_STRING)); // 0.5263157894736842
```

### Octal Usage

```js

const OCTAL_STRING = "150 145 154 154 157 56 40 164 150 151 163 40 151 163 40 141 40 154 157 156 147 40 155 145 163 163 141 147 145 40 143 157 156 164 141 151 156 151 156 147 40 141 40 154 157 164 40 157 146 40 144 141 164 141 56 40 123 155 141 154 154 145 162 40 144 141 164 141 40 151 163 40 154 145 163 163 40 160 162 145 144 151 143 164 141 142 154 145 56 40 120 154 145 141 163 145 40 143 157 156 163 151 144 145 162 40 165 163 151 156 147 40 154 157 156 147 145 162 40 163 164 162 145 141 155 163 40 157 146 40 144 141 164 141 40 146 157 162 40 141 40 150 151 147 150 145 162 40 144 145 147 162 145 145 40 157 146 40 141 143 143 165 162 141 143 171 56 40 124 150 141 156 153 163"

const octalScorer = new EncodingScorer("octal");
console.log(octalScorer.score(OCTAL_STRING)); // 0.8333333333333334
```

### Decimal Usage

```js
const DECIMAL_STRING = "104 101 108 108 111 46 32 116 104 105 115 32 105 115 32 97 32 108 111 110 103 32 109 101 115 115 97 103 101 32 99 111 110 116 97 105 110 105 110 103 32 97 32 108 111 116 32 111 102 32 100 97 116 97 46 32 83 109 97 108 108 101 114 32 100 97 116 97 32 105 115 32 108 101 115 115 32 112 114 101 100 105 99 116 97 98 108 101 46 32 80 108 101 97 115 101 32 99 111 110 115 105 100 101 114 32 117 115 105 110 103 32 108 111 110 103 101 114 32 115 116 114 101 97 109 115 32 111 102 32 100 97 116 97 32 102 111 114 32 97 32 104 105 103 104 101 114 32 100 101 103 114 101 101 32 111 102 32 97 99 99 117 114 97 99 121 46 32 84 104 97 110 107 115"

const decimalScorer = new EncodingScorer("decimal");
console.log(decimalScorer.score(DECIMAL_STRING)); // 0.8333333333333334
```

### Custom Regex Pattern

```js
const DECIMAL_STRING = "84 72 73 83 32 73 83 32 65 32 84 69 83 84 33 32 58 41" // THIS IS A TEST! :)
const PATTERN = "[A-Z]" // Only allow uppercase alphabet.
const PATTERN2 = "[A-Z:)!\\s]" // ALlow all of the characters.
// NOTE: Must use `\\s` for space here.

const decimalScorer = new EncodingScorer("decimal", PATTERN);
console.log(decimalScorer.score(DECIMAL_STRING)); // 0.6111111111111112

const decimalScorer2 = new EncodingScorer("decimal", PATTERN2);
console.log(decimalScorer2.score(DECIMAL_STRING)); // 1
```
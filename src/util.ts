import { crypto } from '@std/crypto/crypto'
import { encodeHex } from '@std/encoding/hex'

const encoder = new TextEncoder()

export async function hash(text: string) {
  return encodeHex(await crypto.subtle.digest('SHA-256', encoder.encode(text)))
}

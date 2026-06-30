// One-off icon generator — pure Node (zlib), no extra deps. Produces flat
// orange-square + white-checkmark PNGs for the PWA manifest / favicons.
const fs = require('fs')
const path = require('path')
const zlib = require('zlib')

const BG = [0xff, 0x4d, 0x00, 0xff] // var(--accent)
const FG = [0xff, 0xff, 0xff, 0xff]

const CRC_TABLE = (() => {
  const table = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[n] = c >>> 0
  }
  return table
})()

function crc32(buf) {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii')
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)
  const crcBuf = Buffer.alloc(4)
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0)
  return Buffer.concat([len, typeBuf, data, crcBuf])
}

// distance from point P to segment AB
function distToSegment(px, py, ax, ay, bx, by) {
  const abx = bx - ax, aby = by - ay
  const apx = px - ax, apy = py - ay
  const lenSq = abx * abx + aby * aby
  let t = lenSq === 0 ? 0 : (apx * abx + apy * aby) / lenSq
  t = Math.max(0, Math.min(1, t))
  const cx = ax + t * abx, cy = ay + t * aby
  return Math.hypot(px - cx, py - cy)
}

function makePng(size) {
  const s = size / 512
  const A = [140 * s, 280 * s]
  const B = [222 * s, 362 * s]
  const C = [392 * s, 158 * s]
  const hw = 19 * s

  const raw = Buffer.alloc((1 + size * 4) * size)
  for (let y = 0; y < size; y++) {
    const rowStart = y * (1 + size * 4)
    raw[rowStart] = 0 // filter: none
    for (let x = 0; x < size; x++) {
      const dAB = distToSegment(x, y, A[0], A[1], B[0], B[1])
      const dBC = distToSegment(x, y, B[0], B[1], C[0], C[1])
      const isCheck = dAB <= hw || dBC <= hw
      const px = rowStart + 1 + x * 4
      const color = isCheck ? FG : BG
      raw[px] = color[0]; raw[px + 1] = color[1]; raw[px + 2] = color[2]; raw[px + 3] = color[3]
    }
  }

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8   // bit depth
  ihdr[9] = 6   // color type RGBA
  ihdr[10] = 0
  ihdr[11] = 0
  ihdr[12] = 0

  const idat = zlib.deflateSync(raw)
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

const outDir = path.join(__dirname, '..', 'public')
const sizes = [32, 180, 192, 512]
for (const size of sizes) {
  fs.writeFileSync(path.join(outDir, `icon-${size}.png`), makePng(size))
  console.log(`wrote icon-${size}.png`)
}

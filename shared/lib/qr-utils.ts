// SOURCE: shared/lib/qr-utils.ts — update clients/*/lib/qr-utils.ts if changing

export function buildQRUrl(listingId: string, baseUrl?: string): string {
  const base = baseUrl || process.env.NEXT_PUBLIC_APP_URL || 'https://western-n-third.com'
  return `${base}/qr/${listingId}`
}

export function buildQRImageUrl(destinationUrl: string, size = 256): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(destinationUrl)}&bgcolor=ffffff&color=1a1a1a&margin=2`
}

export function detectDeviceType(ua: string): 'mobile' | 'tablet' | 'desktop' {
  if (/tablet|ipad/i.test(ua)) return 'tablet'
  if (/mobile|android|iphone/i.test(ua)) return 'mobile'
  return 'desktop'
}

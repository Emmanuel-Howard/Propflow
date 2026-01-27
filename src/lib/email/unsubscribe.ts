import { createHmac } from 'crypto'
import type { UnsubscribeTokenPayload } from '@/types/database'

const UNSUBSCRIBE_SECRET = process.env.UNSUBSCRIBE_SECRET
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

// Token expiration: 90 days in milliseconds
const TOKEN_EXPIRATION_MS = 90 * 24 * 60 * 60 * 1000

/**
 * Generates an HMAC signature for the token payload
 */
function generateSignature(payload: string): string {
  if (!UNSUBSCRIBE_SECRET) {
    throw new Error('UNSUBSCRIBE_SECRET environment variable is not set')
  }
  return createHmac('sha256', UNSUBSCRIBE_SECRET)
    .update(payload)
    .digest('base64url')
}

/**
 * Generates an unsubscribe token for a contact and campaign
 * Format: base64url(contactId:campaignId:timestamp:signature)
 */
export function generateUnsubscribeToken(
  contactId: string,
  campaignId: string
): string {
  const timestamp = Date.now()
  const payload = `${contactId}:${campaignId}:${timestamp}`
  const signature = generateSignature(payload)
  const token = `${payload}:${signature}`
  return Buffer.from(token).toString('base64url')
}

/**
 * Verifies and decodes an unsubscribe token
 * Returns the payload if valid, null if invalid or expired
 */
export function verifyUnsubscribeToken(
  token: string
): UnsubscribeTokenPayload | null {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf-8')
    const parts = decoded.split(':')

    if (parts.length !== 4) {
      return null
    }

    const [contactId, campaignId, timestampStr, providedSignature] = parts
    const timestamp = parseInt(timestampStr, 10)

    if (isNaN(timestamp)) {
      return null
    }

    // Check if token has expired
    if (Date.now() - timestamp > TOKEN_EXPIRATION_MS) {
      return null
    }

    // Verify signature
    const payload = `${contactId}:${campaignId}:${timestamp}`
    const expectedSignature = generateSignature(payload)

    if (providedSignature !== expectedSignature) {
      return null
    }

    return {
      contactId,
      campaignId,
      timestamp,
    }
  } catch {
    return null
  }
}

/**
 * Generates the full unsubscribe URL for a contact/campaign
 */
export function generateUnsubscribeUrl(
  contactId: string,
  campaignId: string
): string {
  const token = generateUnsubscribeToken(contactId, campaignId)
  return `${APP_URL}/unsubscribe/${token}`
}

/**
 * Generates the full preferences URL for a contact/campaign
 */
export function generatePreferencesUrl(
  contactId: string,
  campaignId: string
): string {
  const token = generateUnsubscribeToken(contactId, campaignId)
  return `${APP_URL}/preferences/${token}`
}

/**
 * Generates the one-click unsubscribe URL (for RFC 8058 List-Unsubscribe-Post)
 */
export function generateOneClickUnsubscribeUrl(
  contactId: string,
  campaignId: string
): string {
  const token = generateUnsubscribeToken(contactId, campaignId)
  return `${APP_URL}/api/unsubscribe?token=${token}`
}

/**
 * Generates RFC 8058 compliant email headers for unsubscribe
 */
export function generateUnsubscribeHeaders(
  contactId: string,
  campaignId: string,
  mailtoAddress?: string
): {
  'List-Unsubscribe': string
  'List-Unsubscribe-Post': string
} {
  const oneClickUrl = generateOneClickUnsubscribeUrl(contactId, campaignId)
  const mailtoUrl = mailtoAddress ? `<mailto:${mailtoAddress}>` : ''

  return {
    'List-Unsubscribe': mailtoUrl
      ? `<${oneClickUrl}>, ${mailtoUrl}`
      : `<${oneClickUrl}>`,
    'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
  }
}

---
name: gdpr-data-handling
description: Practical implementation guide for GDPR-compliant data processing, consent management, data subject rights (DSAR/erasure/portability), data retention policies, and privacy-by-design patterns. Use when designing user data schemas, implementing cookie/telemetry consent, handling user deletion cascades, or securing PII in web applications.
license: MIT
metadata:
  author: wshobson
  version: "1.0"
---

# GDPR Data Handling & Privacy Engineering

Practical engineering guide for GDPR-compliant data processing, consent tracking, data subject rights (DSRs/DSARs), retention enforcement, and privacy-by-design patterns in web applications.

## When to Use This Skill

- Designing or updating database schemas storing personal data (PII).
- Implementing consent management, cookie preferences, and marketing opt-ins.
- Building Data Subject Access Request (DSAR) workflows (Right to Access, Portability, Rectification).
- Implementing "Right to be Forgotten" (Account Deletion & data erasure cascades).
- Establishing data retention, archiving, and automated anonymization pipelines.
- Adding logging/telemetry while ensuring no raw PII leaks into observability systems.

---

## Core Privacy Engineering Principles

### 1. Data Minimization (Article 5(1)(c))
- Collect only the minimum personal data strictly necessary for the specified purpose.
- Separate core authentication identity from optional profiling attributes.
- Avoid persistent storage of transient PII (e.g., intermediate form state, raw IP addresses in analytics).

### 2. Legal Basis & Purpose Limitation (Article 6)
Every personal data field must be associated with a valid legal basis:
- **Consent:** Requires explicit, informed, affirmative action (no pre-ticked checkboxes). Must be as easy to withdraw as to give.
- **Contractual Necessity:** Data required to fulfill the user agreement (e.g., shipping address for physical delivery, email for order receipt).
- **Legitimate Interest:** Balancing test required (e.g., fraud prevention, system security).
- **Legal Obligation:** Tax, accounting, and anti-money laundering records (must be isolated from general user profiles during deletion).

---

## Technical Implementations & Patterns

### 1. Consent State Schema & Audit Logging

Store explicit consent records with immutable timestamped audit logs:

```typescript
// Schema: User Consent State
interface UserConsentState {
  userId: string;
  consentVersion: string; // e.g. "v2.1_2026-05-01"
  purposes: {
    essential: true; // Always true (strictly necessary for service operation)
    analytics: boolean;
    marketingEmails: boolean;
    personalizedAds: boolean;
    thirdPartySharing: boolean;
  };
  consentedAt: string; // ISO 8601
  updatedAt: string;
  ipHashAtConsent?: string; // One-way salted hash of IP (do not store raw IP)
}

// Immutable Consent Audit Ledger
interface ConsentAuditEntry {
  id: string;
  userId: string;
  purpose: string;
  action: 'granted' | 'revoked' | 'updated';
  timestamp: string;
  policyVersion: string;
  source: 'web_banner' | 'user_settings' | 'signup_flow';
}
```

### 2. Right to Erasure / "Right to be Forgotten" (Article 17)

When a user requests deletion, execute an orchestrated erasure cascade:

#### Erasure Sequence:
1. **Verify Identity:** Authenticate the request via active session + re-authentication or verified email confirmation token.
2. **Revoke Active Sessions & Tokens:** Immediately terminate sessions and revoke refresh tokens.
3. **Hard-Delete PII:** Remove sensitive personal data from operational databases (`name`, `email`, `phone`, `addresses`, `social_logins`).
4. **Anonymize Analytical & Transactional Data:**
   - Detach transactions and analytics events from the user ID by replacing `userId` with an unlinked cryptographic hash or tombstone identifier (`DELETED_USER_<UUID>`).
   - Retain tax/financial records only where legally mandated by local accounting law, in an isolated archive table with restricted access.
5. **Propagate to Third-Party Processors:** Issue webhooks/API calls to downstream sub-processors (Stripe customer deletion, SendGrid email suppression, CRM removal).
6. **Storage & Backups:** Ensure PII in log aggregators/backups naturally expires within standard retention windows (e.g., 30–90 days).

```typescript
// Example: Anonymization pattern for retained operational events
export function anonymizeUserRecord(user: UserRecord): AnonymizedUserRecord {
  return {
    id: `anon_${crypto.randomUUID()}`,
    deletedAt: new Date().toISOString(),
    accountCreatedAt: user.createdAt,
    // Scrub all PII
    email: null,
    displayName: null,
    phoneNumber: null,
    profilePictureUrl: null,
    billingAddress: null,
    isDeleted: true
  };
}
```

### 3. Data Subject Access & Portability (Articles 15 & 20)

Users have the right to receive a copy of their personal data in a structured, commonly used, machine-readable format (JSON / CSV):

```typescript
// DSAR Export Bundling Schema
interface DSARDataExport {
  exportMetadata: {
    generatedAt: string;
    userId: string;
    formatVersion: '1.0';
  };
  profile: {
    accountDetails: Record<string, any>;
    consentHistory: ConsentAuditEntry[];
  };
  activityLogs: Array<{ timestamp: string; action: string; meta?: any }>;
  userGeneratedContent: any[];
}
```

### 4. Telemetry & Log Sanitization (Zero-PII Logging)

Never write plain PII to logs, monitoring tools (Sentry, Datadog), or crash reports:

- **Mask Emails:** `s***y@domain.com`
- **Mask Payment Tokens:** `****-****-****-1234`
- **IP Addresses:** Truncate (IPv4 `/24` or IPv6 `/48`) or hash with a daily rotating salt before storing in analytics.
- **URLs & Query Strings:** Strip query parameters containing tokens, emails, or reset keys (`/auth/callback?token=REDACTED`).

```typescript
export function sanitizeLogData(data: Record<string, any>): Record<string, any> {
  const SENSITIVE_KEYS = /password|secret|token|apiKey|creditCard|ssn|dob|email/i;
  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(data)) {
    if (SENSITIVE_KEYS.test(key) && typeof value === 'string') {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeLogData(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}
```

---

## GDPR Engineering Checklist

- [ ] **Consent Capture:** Explicit affirmative action; granular options (essential vs analytics vs marketing).
- [ ] **Consent Revocation:** Accessible in user settings with one-click revocation.
- [ ] **Cookie Banner:** Blocks non-essential scripts/cookies until consent is explicitly granted.
- [ ] **Erasure Cascade:** Complete deletion/anonymization across primary DB, file storage, and third-party APIs.
- [ ] **Data Export (DSAR):** Machine-readable JSON export available upon verified request.
- [ ] **Retention Windows:** Automated cleanup for stale temporary data, unverified accounts, and expired tokens.
- [ ] **Log Hygiene:** Automated redaction of PII before sending to logging/monitoring sinks.

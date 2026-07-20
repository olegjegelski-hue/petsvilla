/**
 * PetsVilla OÜ kanoonilised kontaktandmed — üks allikas (ära dubleeri Jüri/Männi vms).
 */
export const SITE_CONTACT = {
  legalName: 'PetsVilla OÜ',
  email: 'service@petsvilla.ee',
  phoneDisplay: '+372 512 7938',
  phoneLocal: '5127938',
  phoneCountryCode: '+372',
  streetAddress: 'Tartu mnt 80',
  locality: 'Soinaste',
  municipality: 'Kambja vald',
  region: 'Tartumaa',
  postalCode: '61709',
  country: 'EE',
} as const

/** Üherealine aadress (õiguslehed, footer). */
export function getCanonicalAddressLine(): string {
  const c = SITE_CONTACT
  return `${c.streetAddress}, ${c.locality}, ${c.municipality}, ${c.region} ${c.postalCode}`
}

/** Montonio Shipping API sender objekt. */
export function getMontonioSenderAddress() {
  const c = SITE_CONTACT
  return {
    name: c.legalName,
    email: c.email,
    phoneCountryCode: c.phoneCountryCode,
    phoneNumber: c.phoneLocal,
    streetAddress: c.streetAddress,
    locality: c.locality,
    region: c.region,
    postalCode: c.postalCode,
    country: c.country,
  }
}

import { isValidUKMobile, normaliseToE164 } from './utils';

test('isValidUKMobile accepts UK mobile numbers with local or E164 prefixes', () => {
  expect(isValidUKMobile('07901 837 771')).toBe(true);
  expect(isValidUKMobile('07901-837.771')).toBe(true);
  expect(isValidUKMobile('+447901837771')).toBe(true);
});

test('isValidUKMobile rejects non-UK-mobile values', () => {
  expect(isValidUKMobile('')).toBe(false);
  expect(isValidUKMobile('01234 567 890')).toBe(false);
  expect(isValidUKMobile('+441234567890')).toBe(false);
  expect(isValidUKMobile('hello')).toBe(false);
});

test('normaliseToE164 converts local UK mobile numbers', () => {
  expect(normaliseToE164('07901 837 771')).toBe('+447901837771');
  expect(normaliseToE164('07901-837.771')).toBe('+447901837771');
});

test('normaliseToE164 preserves already-normalised and otherwise cleaned values', () => {
  expect(normaliseToE164('+447901837771')).toBe('+447901837771');
  expect(normaliseToE164('01234 567 890')).toBe('01234567890');
});

/** Swaps the old Todotipo brand for Oaken and fixes the legacy "Flutted" typo. */
export const rebrand = (s: string) =>
  s.replace(/todo\s?tipo\.?/gi, 'Oaken').replace(/Flutted/g, 'Fluted').replace(/flutted/g, 'fluted');

/** Legacy product titles that were renamed on import. */
export const TITLE_RENAMES: Record<string, string> = {
  'Flutted wall panel information': 'Fluted Wall Panel',
  'HD Printing wall panel': 'HD Printing Wall Panel',
  'Metal Series wall panel': 'Metal Series Wall Panel',
};

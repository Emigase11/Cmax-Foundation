/** Integration boundary: replace this adapter with a verified Stripe aggregate later. */
export function getFundraising(record: {
  published: boolean;
  amount: number | null;
  currency: string;
  date: string | null;
  financed: string;
  source: string | null;
}) {
  if (
    !record.published ||
    record.amount == null ||
    !Number.isSafeInteger(record.amount) ||
    record.amount < 0 ||
    !record.date ||
    !record.financed ||
    !record.source
  )
    return null;
  return record;
}

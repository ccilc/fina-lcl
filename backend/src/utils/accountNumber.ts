export function generateAccountNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000); // 6 chiffres
  return `FINA-${year}-${random}`;
}

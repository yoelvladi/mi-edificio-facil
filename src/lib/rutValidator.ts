export function validateRut(rut: string): boolean {
  // Remove dots and dashes
  const cleanRut = rut.replace(/\./g, '').replace(/-/g, '');
  
  // Check format
  if (!/^\d{7,8}[0-9Kk]$/.test(cleanRut)) {
    return false;
  }
  
  // Separate body and verifier
  const body = cleanRut.slice(0, -1);
  const verifier = cleanRut.slice(-1).toUpperCase();
  
  // Calculate expected verifier
  let sum = 0;
  let multiplier = 2;
  
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  
  const expectedVerifier = 11 - (sum % 11);
  const finalVerifier = expectedVerifier === 11 ? '0' : expectedVerifier === 10 ? 'K' : expectedVerifier.toString();
  
  return verifier === finalVerifier;
}

export function formatRut(rut: string): string {
  const cleanRut = rut.replace(/\./g, '').replace(/-/g, '');
  const body = cleanRut.slice(0, -1);
  const verifier = cleanRut.slice(-1);
  
  // Format with dots
  const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  return `${formattedBody}-${verifier}`;
}

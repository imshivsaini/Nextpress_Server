
export const isValidEmailBasic = (email) => {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  // Basic regex pattern for email validation
  const basicRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return basicRegex.test(email.trim());
};

export const isValidEmailStrict = (email) => {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  const trimmedEmail = email.trim();
  
  // Check length limits
  if (trimmedEmail.length > 254) {
    return false; 
  }
  
  // Split email into local and domain parts
  const parts = trimmedEmail.split('@');
  if (parts.length !== 2) {
    return false;
  }
  
  const [localPart, domainPart] = parts;
  
  // Validate local part (before @)
  if (!isValidLocalPart(localPart)) {
    return false;
  }
  
  // Validate domain part (after @)
  if (!isValidDomainPart(domainPart)) {
    return false;
  }
  
  return true;
};
const isValidLocalPart = (localPart) => {
  if (!localPart || localPart.length === 0 || localPart.length > 64) {
    return false; 
  };
  if (localPart.includes('..')) {
    return false;
  }
  if (localPart.startsWith('.') || localPart.endsWith('.')) {
    return false;
  }
  const localPartRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/;
  return localPartRegex.test(localPart);
}
  const isValidDomainPart = (domainPart) => {
  if (!domainPart || domainPart.length === 0 || domainPart.length > 253) {
    return false; 
  };
  // Check for consecutive dots
  if (domainPart.includes('..')) {
    return false;
  }
  if (domainPart.startsWith('.') || domainPart.endsWith('.')) {
    return false;
  }
   const labels = domainPart.split('.');
   if (labels.length < 2) {
    return false;
  }
   return true;
}
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim()
    .slice(0, 1000); // Limit length
};

export const validateQueryInput = (query: string): {
  isValid: boolean;
  error?: string;
} => {
  if (!query.trim()) {
    return { isValid: false, error: 'Query cannot be empty' };
  }
  
  if (query.length < 3) {
    return { isValid: false, error: 'Query must be at least 3 characters long' };
  }
  
  if (query.length > 500) {
    return { isValid: false, error: 'Query must be less than 500 characters' };
  }
  
  // Check for potentially malicious content
  const maliciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /data:text\/html/i
  ];
  
  for (const pattern of maliciousPatterns) {
    if (pattern.test(query)) {
      return { isValid: false, error: 'Query contains invalid content' };
    }
  }
  
  return { isValid: true };
};
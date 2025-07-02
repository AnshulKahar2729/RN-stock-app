// utils/formatUtils.ts - Safe formatting utilities
export const safeParseFloat = (
  value: string | number | null | undefined,
): number => {
  if (value === null || value === undefined || value === '') {
    return 0;
  }

  const str = String(value).trim();

  // Handle common invalid values from APIs
  if (
    str === 'N/A' ||
    str === 'NaN' ||
    str === 'None' ||
    str === '--' ||
    str === 'null' ||
    str === 'undefined'
  ) {
    return 0;
  }

  // Remove any non-numeric characters except decimal point and minus sign
  const cleanStr = str.replace(/[^0-9.-]/g, '');

  const parsed = parseFloat(cleanStr);
  return isNaN(parsed) ? 0 : parsed;
};

export const formatCurrency = (
  value: string | number | null | undefined,
): string => {
  const numValue = safeParseFloat(value);

  if (numValue === 0) {
    return 'N/A';
  }

  try {
    // Handle large numbers with abbreviations
    if (Math.abs(numValue) >= 1e12) {
      return `$${(numValue / 1e12).toFixed(2)}T`;
    } else if (Math.abs(numValue) >= 1e9) {
      return `$${(numValue / 1e9).toFixed(2)}B`;
    } else if (Math.abs(numValue) >= 1e6) {
      return `$${(numValue / 1e6).toFixed(2)}M`;
    } else if (Math.abs(numValue) >= 1e3) {
      return `$${(numValue / 1e3).toFixed(2)}K`;
    }

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numValue);
  } catch (error) {
    console.warn('Error formatting currency:', error);
    return '$0.00';
  }
};

export const formatPercentage = (
  value: string | number | null | undefined,
): string => {
  const numValue = safeParseFloat(value);

  if (numValue === 0) {
    return 'N/A';
  }

  try {
    // Convert to percentage if the value is a decimal (e.g., 0.05 -> 5%)
    const percentValue =
      numValue < 1 && numValue > -1 ? numValue * 100 : numValue;

    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(percentValue / 100);
  } catch (error) {
    console.warn('Error formatting percentage:', error);
    return '0.00%';
  }
};

export const formatValue = (
  value: string | number | null | undefined,
): string => {
  if (value === null || value === undefined || value === '') {
    return 'N/A';
  }

  const str = String(value).trim();

  // Handle common invalid values
  if (
    str === 'N/A' ||
    str === 'NaN' ||
    str === 'None' ||
    str === '--' ||
    str === 'null'
  ) {
    return 'N/A';
  }

  // Check if it's a number
  const numValue = safeParseFloat(str);
  if (numValue !== 0 && !isNaN(numValue)) {
    try {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(numValue);
    } catch (error) {
      return str;
    }
  }

  // Return as string if not a number
  return str;
};

export const formatLargeNumber = (
  value: string | number | null | undefined,
): string => {
  const numValue = safeParseFloat(value);

  if (numValue === 0) {
    return 'N/A';
  }

  try {
    if (Math.abs(numValue) >= 1e12) {
      return `${(numValue / 1e12).toFixed(2)}T`;
    } else if (Math.abs(numValue) >= 1e9) {
      return `${(numValue / 1e9).toFixed(2)}B`;
    } else if (Math.abs(numValue) >= 1e6) {
      return `${(numValue / 1e6).toFixed(2)}M`;
    } else if (Math.abs(numValue) >= 1e3) {
      return `${(numValue / 1e3).toFixed(2)}K`;
    }

    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(numValue);
  } catch (error) {
    console.warn('Error formatting large number:', error);
    return '0';
  }
};

// Safe date formatting
export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) {
    return 'N/A';
  }

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'N/A';
    }

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (error) {
    console.warn('Error formatting date:', error);
    return 'N/A';
  }
};

// Utility to check if a value is valid for display
export const isValidValue = (value: any): boolean => {
  if (value === null || value === undefined || value === '') {
    return false;
  }

  const str = String(value).trim();
  return (
    str !== 'N/A' &&
    str !== 'NaN' &&
    str !== 'None' &&
    str !== '--' &&
    str !== 'null'
  );
};

export type Theme = {
  background: string;
  card: string;
  text: string;
  subtext: string;
  border: string;
  primary: string;
  accent: string;
  error: string;
  header: string;
  tabBarActive: string;
  tabBarInactive: string;
  chart: {
    background: string;
    line: string;
    label: string;
  };
  font: {
    size: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
    };
    weight: {
      regular: string;
      medium: string;
      bold: string;
      extrabold: string;
    };
  };
  shadow: {
    color: string;
    opacity: number;
    radius: number;
    offset: { width: number; height: number };
    elevation: number;
  };
};

export const lightTheme: Theme = {
  background: '#F9FAFB',
  card: '#FFFFFF',
  text: '#111827',
  subtext: '#6B7280',
  border: '#E5E7EB',
  primary: '#007AFF',
  accent: '#374151',
  error: '#EF4444',
  header: '#FFFFFF',
  tabBarActive: '#007AFF',
  tabBarInactive: 'gray',
  chart: {
    background: '#ffffff',
    line: 'rgba(37, 99, 235, 1)',
    label: 'rgba(0, 0, 0, 1)',
  },
  font: {
    size: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
    },
    weight: {
      regular: '400',
      medium: '500',
      bold: '700',
      extrabold: '800',
    },
  },
  shadow: {
    color: '#000',
    opacity: 0.08,
    radius: 4,
    offset: { width: 0, height: 2 },
    elevation: 3,
  },
};

export const darkTheme: Theme = {
  background: '#18181B',
  card: '#23232A',
  text: '#F3F4F6',
  subtext: '#A1A1AA',
  border: '#27272A',
  primary: '#60A5FA',
  accent: '#60A5FA',
  error: '#F87171',
  header: '#23232A',
  tabBarActive: '#60A5FA',
  tabBarInactive: '#52525B',
  chart: {
    background: '#23232A',
    line: 'rgba(96, 165, 250, 1)',
    label: 'rgba(243, 244, 246, 1)',
  },
  font: {
    size: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
    },
    weight: {
      regular: '400',
      medium: '500',
      bold: '700',
      extrabold: '800',
    },
  },
  shadow: {
    color: '#000',
    opacity: 0.16,
    radius: 4,
    offset: { width: 0, height: 2 },
    elevation: 3,
  },
};

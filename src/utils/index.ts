export const formatPercentage = (value: string) => {
    if (!value || value === 'None') return 'N/A';
    const num = parseFloat(value);
    return `${(num * 100).toFixed(2)}%`;
  };

export const formatValue = (value: string) => {
    if (!value || value === 'None') return 'N/A';
    return value;
  };

export const formatCurrency = (value: string) => {
    if (!value || value === 'None') return 'N/A';
    const num = parseFloat(value);
    if (num >= 1e12) return `₹${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `₹${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `₹${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `₹${(num / 1e3).toFixed(2)}K`;

    return `₹${num.toFixed(2)}`;
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
};

export const darkTheme: Theme = {
  background: '#18181B',
  card: '#23232A',
  text: '#F3F4F6',
  subtext: '#A1A1AA',
  border: '#27272A',
  primary: '#60A5FA',
  accent: '#818CF8',
  error: '#F87171',
  header: '#23232A',
  tabBarActive: '#60A5FA',
  tabBarInactive: '#52525B',
  chart: {
    background: '#23232A',
    line: 'rgba(96, 165, 250, 1)',
    label: 'rgba(243, 244, 246, 1)',
  },
};

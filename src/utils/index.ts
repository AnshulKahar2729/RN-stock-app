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

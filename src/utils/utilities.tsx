function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Utility function to calculate relative date
const getRelativeDate = (dateString: string): string => {
  const date: Date = new Date(dateString);
  const now: Date = new Date();
  const diffTime: number = Math.abs(now.getTime() - date.getTime());
  const diffDays: number = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 30) {
    return `${diffDays} days ago`;
  } else if (diffDays < 365) {
    const diffMonths: number = Math.ceil(diffDays / 30);
    return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
  } else {
    const diffYears: number = Math.ceil(diffDays / 365);
    return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
  }
};

const utilities = { capitalize, getRelativeDate };

export default utilities;

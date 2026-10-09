export const formatPublishDate = (dateString?: string) => {
  if (!dateString) return "OCTOBER 08, 2026 04:56 PM";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "OCTOBER 08, 2026 04:56 PM";
    
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'long',
      day: '2-digit',
      year: 'numeric',
    }).toUpperCase();
    
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    
    return `${formattedDate} ${formattedTime}`;
  } catch {
    return "OCTOBER 08, 2026 04:56 PM";
  }
};

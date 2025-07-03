export const formatTime24to12 = (time24: string): string => {
    const [hours24, minutes] = time24.split(':').map(Number);
    
    const period = hours24 >= 12 ? 'pm' : 'am';
    const hours12 = hours24 % 12 || 12; // Convert 0 to 12 for midnight
    
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
};

export const formatDate = (date: string, time: string): string => {
    const dateObj = new Date(`${date} ${time}`);
    return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}; 
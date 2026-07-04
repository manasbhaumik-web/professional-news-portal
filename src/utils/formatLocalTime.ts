export const formatLocalTime = (dateStr: string, publishedAt?: string) => {
    if (!dateStr || dateStr === "Just Now") return dateStr || "";
    const dateToUse = publishedAt ? new Date(publishedAt) : new Date(dateStr);
    if (isNaN(dateToUse.getTime())) return dateStr;
    return dateToUse.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

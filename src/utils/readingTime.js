export const calculateReadingTime = (markdown) => {
    const words = markdown
        .trim()
        .split(/\s+/)
        .filter(word => word.length > 0);

    return Math.max(1, Math.ceil(words.length / 200));
};
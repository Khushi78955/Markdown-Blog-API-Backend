export const extractTags = (markdown) => {
    const matches = markdown.match(/#(\w+)/g);
    if (!matches) {
        return [];
    }
    return [...new Set(
        matches.map(tag =>
            tag.substring(1).toLowerCase()
        )
    )];
};
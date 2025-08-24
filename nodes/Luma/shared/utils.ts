export function parseCommaSeparatedIds(list: string): string[] {
    if (!list?.length) {
        return [];
    }

    return list
        .trim()
        .split(',')
        .map(id => id.trim())
        .filter(id => id.length > 0);
}

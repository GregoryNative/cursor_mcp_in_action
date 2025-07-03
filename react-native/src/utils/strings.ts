/**
 * Capitalizes the first letter of a string
 * @param str The string to capitalize
 * @returns The string with its first letter capitalized
 */
export function capitalizeFirstLetter(str: string): string {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
} 
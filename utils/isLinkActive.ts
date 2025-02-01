/**
 * Check if the current path is active for the given link
 * @param currentPath - The current path
 * @param linkPath - The path of the link
 * @param locale - The current locale
 * @returns true if the current path is active for the given link, false otherwise
 */
function isLinkActive(
    currentPath: string,
    linkPath: string,
    locale?: string
): boolean {
    // Remove trailing slashes for consistency
    const normalizePath = (path: string) => path.replace(/\/$/, "");

    const normalizedCurrent = normalizePath(currentPath);
    const normalizedLink = normalizePath(linkPath);

    // Special case for the home link
    if (locale && normalizedLink === `/${locale}`) {
        return normalizedCurrent === `/${locale}`;
    }

    // Exact match or subpath match
    return (
        normalizedCurrent === normalizedLink ||
        normalizedCurrent.startsWith(`${normalizedLink}/`)
    );
}

export default isLinkActive;

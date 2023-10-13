
/**
 * 
 * @param {{
 *   maxAge?:number
 * }} args 
 * @returns 
 */
export const getCookieOptions = (args = {}) => {
    const {
        maxAge
    } = args;
    //
    const cookieOptions = { path: "/" };
    if (typeof maxAge !== "undefined") {
        cookieOptions.maxAge = maxAge;
    }
    const secure = !!JSON.parse(process.env.COOKIE_SECURE || 'false');
    if (secure) cookieOptions.secure = true;
    const sameSite = process.env.COOKIE_SAME_SITE;
    if (sameSite) cookieOptions.sameSite = sameSite;
    const domain = process.env.COOKIE_DOMAIN;
    if (domain) cookieOptions.domain = domain;
    return cookieOptions;
}

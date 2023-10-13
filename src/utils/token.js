export function getAccessTokenKey() {
    const key = "x-access-token";
    const prefix = process.env.TOKEN_PREFIX || "";
    return prefix ? `${prefix}-${key}` : key;
}

export function getRefreshTokenKey() {
    const key = "x-refresh-token";
    const prefix = process.env.TOKEN_PREFIX || "";
    return prefix ? `${prefix}-${key}` : key;
}

export function getCMSAccessTokenKey() {
    const key = "x-cms-access-token";
    const prefix = process.env.CMS_TOKEN_PREFIX || "";
    return prefix ? `${prefix}-${key}` : key;
}

export function getCMSRefreshTokenKey() {
    const key = "x-cms-refresh-token";
    const prefix = process.env.CMS_TOKEN_PREFIX || "";
    return prefix ? `${prefix}-${key}` : key;
}
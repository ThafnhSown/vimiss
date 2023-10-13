import { UnauthorizedError } from "@/common/errors";
import { verifyCredentials } from "@/services/jwt.helper";
import { getAccessTokenKey, getCMSAccessTokenKey } from "@/utils/token";
import { AuthErrorCode } from "@gitlab-koolsoft-dev/vimiss-portal-config/authCode";

/**
 * 
 * @param {import("@/services/jwt.helper").AuthRequest} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */
export function jwtMiddleware(req, res, next) {
    let token = req.cookies[getAccessTokenKey()];
    const authHeader = req.headers.authorization;
    if (!token) {
        if (!authHeader) throw new UnauthorizedError();

        const [authType, _token] = (authHeader || "").split(" ");
        if (authType.toLowerCase() !== "bearer" || !_token) throw new UnauthorizedError();

        token = _token;
    }
    const credential = verifyCredentials({ type: "accessToken", token });
    if (!credential) throw new UnauthorizedError();

    if (credential.tokenExpired) throw new UnauthorizedError({ data: AuthErrorCode.TokenExpired });

    req.credential = credential;
    return next();
}

/**
 * 
 * @param {import("@/services/jwt.helper").AuthRequest} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */
export function jwtCMS(req, res, next) {
    const token = req.cookies[getCMSAccessTokenKey()];
    if (!token) throw new UnauthorizedError();
    const credential = verifyCredentials({ type: "accessToken", token });
    if (!credential) throw new UnauthorizedError();

    if (credential.tokenExpired) throw new UnauthorizedError({ data: AuthErrorCode.TokenExpired });

    req.credential = credential;
    return next();
}
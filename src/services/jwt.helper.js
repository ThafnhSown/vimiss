import crypto from "crypto";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

export function getAccessTokenSecret() {
  return process.env.ACCESS_TOKEN_SECRET || "EK6iLjIlXcW59cDTUrUDrEC8YbB7Tx8d";
}

export function getRefreshTokenSecret() {
  return process.env.REFRESH_TOKEN_SECRET || "pm3Epm2w5WJ4NXzzRmUZDlHfa1Y0ZuYj"
}

function getAccessTokenExp() {
  const env = process.env.ACCESS_TOKEN_EXP || 600;
  if (!isNaN(+env)) return +env;
  return env
}

function getRefreshTokenExp() {
  const env = process.env.REFRESH_TOKEN_EXP || '7d';
  if (!isNaN(+env)) return +env;
  return env;
}

/**
 * 
 * @typedef {"accessToken" | "refreshToken"} TokenType
 */

/** 
 * @param {{
 * type: TokenType;
 * credential: import("@gitlab-koolsoft-dev/vimiss-portal-config").Credential;
 * }} args 
*/
export function signCredentials(args) {
  const {
    type,
    credential
  } = args;
  const secret = type === "accessToken" ? getAccessTokenSecret() : getRefreshTokenSecret();
  const expiresIn = type === "accessToken" ? getAccessTokenExp() : getRefreshTokenExp();
  const nonce = crypto.randomBytes(6).toString("hex");
  return jwt.sign({ nonce, ...credential }, secret, { expiresIn });
}

/**
 * @param {{
 * type: TokenType;
 * token: string;
 * }} args
 * @returns {Credential & { tokenExpired?: boolean; }} 
*/
export function verifyCredentials(args) {
  const {
    token,
    type
  } = args;
  try {
    const secret = type === "accessToken" ? getAccessTokenSecret() : getRefreshTokenSecret();
    const credential = jwt.verify(token, secret);
    if (typeof credential === "string") return null;
    return credential;
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      if (error instanceof TokenExpiredError) {
        return { tokenExpired: true };
      }
    }
    throw error;
  }
}

/**
 * @typedef {import("express").Request & {
 *  credential?: import("@gitlab-koolsoft-dev/vimiss-portal-config").Credential;
 * }} AuthRequest
 */
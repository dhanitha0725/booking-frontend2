import { jwtDecode } from 'jwt-decode';

export interface DecodedToken {
    sub: string;
    jti: string;
    exp: number;
    iss: string;
    aud: string;
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
    [claim: string]: string | number;
}

export const decodeToken = (token: string): DecodedToken => {
    return jwtDecode<DecodedToken>(token);
}
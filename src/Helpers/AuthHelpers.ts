import { jwtDecode } from "jwt-decode";
import { JwtClaims } from "../Models/JwtClaims";

export function getClaimsFromToken(token: string): JwtClaims | null {
    try {
        // Decode the token using jwt-decode and specify the return type
        const decodedToken = jwtDecode<JwtClaims>(token);
        return decodedToken;
    } catch (error) {
        console.error("Invalid token", error);
        return null;
    }
}
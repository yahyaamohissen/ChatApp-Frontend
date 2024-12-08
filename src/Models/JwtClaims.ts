export interface JwtClaims {
    sub: string; //Id
    username: string;
    given_name: string;
    email: string;
    //roles?: string[]; to be added later
    exp: number;
}
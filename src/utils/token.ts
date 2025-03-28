import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    userId: number;
    email: string;
    role: 'Admin' | 'Employee' | 'Accountant' | 'Hostel' | 'Customer';
    exp: number;
    }

export const decodeToken = (token: string): DecodedToken => {
    return jwtDecode<DecodedToken>(token);
}
// This file defines a custom hook `useAuth` that provides access to the authentication context.
// It allows components to easily access authentication state and methods 
// without needing to directly interact with the context API.

import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
    }

    
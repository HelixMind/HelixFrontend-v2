import { request } from "./main"

const signup = async function(payload: {
    fname: string,
    lname: string,
    email: string,
    password: string
}): Promise<{
    message: string
}> {
    const response = await request<{
        message: string
    }>("/auth/signup", {
        method: "POST",
        body: JSON.stringify({
            fname: payload.fname,
            lname: payload.lname,
            email: payload.email,
            password: payload.password
        }),
        headers: { 
            "Content-Type": "application/json",
        }
    });

    return {
        message: response.message
    }
}

const login = async function(payload: { email: string, password: string}) {
    return request<{
        user: any,
        token: string,
        message: string
    }>(
        "/auth/login",
        {
            body: JSON.stringify({
                email: payload.email,
                password: payload.password
            }),
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
            }
        }
    );
}

const checkAuth = async function() {
    return request<{
        "fname": string,
        "lname": string,
        "email": string,
        "createdAt": string,
        "updatedAt": string
    }>("/me/auth", {
        method: "GET"
    });
}

export {
    signup,
    login,
    checkAuth
}
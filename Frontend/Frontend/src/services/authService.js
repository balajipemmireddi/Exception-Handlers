import API from "../api/axios";

export const login = (data) => {
    return API.post("api/auth/login", data);
};

export const register = (data) => {
    return API.post("api/auth/register", data);
};

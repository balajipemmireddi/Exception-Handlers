import API from "../api/axios";

export const getRevenue = () => {
    return API.get("api/superadmin/revenue");
};

export const getAnalytics = () => {
    return API.get("api/superadmin/analytics");
};

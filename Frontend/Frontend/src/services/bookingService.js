import API from "../api/axios";

export const createBooking = (data) => {
    return API.post("api/bookings", data);
};

export const getUserBookings = (userId) => {
    return API.get(`api/bookings/user/${userId}`);
};

export const cancelBooking = (id) => {
    return API.put(`api/bookings/${id}/cancel`);
};

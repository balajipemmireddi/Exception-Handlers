import API from "../api/axios";

export const getAllBookings = () => {
    return API.get("api/admin/bookings");
};

export const adminUpdateBooking = (id, data) => {
    return API.put(`api/admin/bookings/${id}`, data);
};

export const adminDeleteBooking = (id) => {
    return API.delete(`api/admin/bookings/${id}`);
};

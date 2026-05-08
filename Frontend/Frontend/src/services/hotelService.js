import API from "../api/axios";

export const getHotels = () => {
    return API.get("api/hotels");
};

export const searchHotels = (params) => {
    return API.get("api/hotels/search", { params });
};

export const getHotelById = (id) => {
    return API.get(`api/hotels/${id}`);
};

export const createHotel = (data) => {
    return API.post("api/hotels", data);
};

export const updateHotel = (id, data) => {
    return API.put(`api/hotels/${id}`, data);
};

export const deleteHotel = (id) => {
    return API.delete(`api/hotels/${id}`);
};

import API from "../api/axios";

export const getRoomsByHotel = (hotelId) => {
    return API.get(`api/hotels/${hotelId}/rooms`);
};

export const addRoom = (hotelId, data) => {
    return API.post(`api/hotels/${hotelId}/rooms`, data);
};

export const updateRoom = (hotelId, roomId, data) => {
    return API.put(`api/hotels/${hotelId}/rooms/${roomId}`, data);
};

export const deleteRoom = (hotelId, roomId) => {
    return API.delete(`api/hotels/${hotelId}/rooms/${roomId}`);
};

import apiFetch from './connection/ApiConfig.js';

export const getAllOffers = async () => {
  return await apiFetch('/offer/all');
};

export const getCityWithID = async (cityId) => {
  if (!cityId) throw new Error('City ID is required');
  return await apiFetch(`/city/id/${cityId}`);
};
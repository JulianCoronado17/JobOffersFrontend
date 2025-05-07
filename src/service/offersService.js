import apiFetch from './connection/ApiConfig.js';

export const getAllOffers = async () => {
  return await apiFetch('/offer/all');
};


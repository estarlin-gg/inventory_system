import api from "axios";
import { FullAnalyticsResponse } from "../models/analytic";
import { Sale, SaleDto } from "../models/sale";
const API_URL = import.meta.env.VITE_API_URL;

export const getFullAnalytics = async () => {
  return await api.get<FullAnalyticsResponse>(`${API_URL}/analytic/all`);
};

export const getSalesToday = async () => {
  return await api.get<Sale[]>(`${API_URL}/analytic/day`);
};

export const createSale = async (c: SaleDto) => {
  return await api.post(`${API_URL}/sale`, c);
};

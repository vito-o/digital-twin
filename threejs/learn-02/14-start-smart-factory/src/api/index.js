import axios from "axios";

export function getSmartCityInfo() {
  return axios.get("/api/smartcity/info");
}

export function getSmartCityList() {
  return axios.get("/api/smartcity/list");
}

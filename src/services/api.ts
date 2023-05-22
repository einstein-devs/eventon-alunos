import { HOST_API } from "@/utils/api-config";
import axios from "axios";
import { parseCookies } from "nookies";

const { "@eventon.token": token } = parseCookies();

console.log("OSH " + HOST_API);

export const api = axios.create({
  baseURL: HOST_API,
});

if (token) {
  api.defaults.headers["Authorization"] = `Bearer ${token}`;
}

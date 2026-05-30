import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000/api", //Change port 3000 into a real port that backend used
  headers: {
    "Content-Type": "application/json",
  },
});
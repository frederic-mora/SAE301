// client/src/data/categories.js
import { API_URL } from "../lib/api-request.js";
export async function fetchCategory(target) {
    const url = `${API_URL}categories/${encodeURIComponent(target)}`;
    const response = await fetch(url);
    return response.json();
}

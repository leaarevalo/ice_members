import axios from "axios";

const url = process.env.VUE_APP_MEMBERS_URL;

export async function getHistoryByUser(userId) {
    let token = localStorage.getItem("access_token");
    const { data } = await axios.get(`${url}/history/user/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
}

export async function createHistory(userId, content) {
    let token = localStorage.getItem("access_token");
    const { data } = await axios.post(`${url}/history`, {
        userId,
        content,
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
}

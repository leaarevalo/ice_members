import axios from "axios";

const url = process.env.VUE_APP_MEMBERS_URL;

export async function getManagers() {
    let token = localStorage.getItem("access_token");
    const { data } = await axios.get(`${url}/auth/managers`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
}

export async function updateManager(managerId, managerData) {
    let token = localStorage.getItem("access_token");
    const { data } = await axios.put(`${url}/auth/managers/${managerId}`, managerData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
}

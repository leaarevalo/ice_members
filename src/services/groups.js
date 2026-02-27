import axios from "axios";

const url = process.env.VUE_APP_MEMBERS_URL;

export async function getGroups() {
    let token = localStorage.getItem("access_token");
    const { data } = await axios.get(`${url}/groups`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
}

export async function createGroup(group) {
    let token = localStorage.getItem("access_token");
    const { data } = await axios.post(`${url}/groups`, {
        name: group.name,
        description: group.description,
        managers: group.managers,
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
}

export async function updateGroup(group) {
    let token = localStorage.getItem("access_token");
    const { data } = await axios.put(`${url}/groups/${group._id}`, {
        name: group.name,
        description: group.description,
        managers: group.managers,
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
}

export async function deleteGroup(id) {
    let token = localStorage.getItem("access_token");
    const { data } = await axios.delete(`${url}/groups/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
}

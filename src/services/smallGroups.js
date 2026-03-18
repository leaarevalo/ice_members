import axios from "axios";

const url = process.env.VUE_APP_MEMBERS_URL;

export async function getSmallGroups() {
    let token = localStorage.getItem("access_token");
    const { data } = await axios.get(`${url}/small-groups`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
}

export async function getSmallGroupsByGroup(groupId) {
    let token = localStorage.getItem("access_token");
    const { data } = await axios.get(`${url}/small-groups/group/${groupId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
}

export async function createSmallGroup(smallGroup) {
    let token = localStorage.getItem("access_token");
    const { data } = await axios.post(`${url}/small-groups`, smallGroup, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
}

export async function updateSmallGroup(smallGroup) {
    let token = localStorage.getItem("access_token");
    const { data } = await axios.put(`${url}/small-groups/${smallGroup._id}`, smallGroup, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
}

import axios from "axios";

const url = process.env.VUE_APP_MEMBERS_URL;

export async function getSchools() {
    let token = localStorage.getItem("access_token");
    const { data } = await axios.get(`${url}/schools`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
}

export async function createSchool(school) {
    let token = localStorage.getItem("access_token");
    const { data } = await axios.post(`${url}/schools`, {
        name: school.name,
        description: school.description,
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
}

export async function updateSchool(school) {
    let token = localStorage.getItem("access_token");
    const { data } = await axios.put(`${url}/schools/${school._id}`, {
        name: school.name,
        description: school.description,
        isActive: school.isActive,
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
}

export async function deleteSchool(id) {
    let token = localStorage.getItem("access_token");
    const { data } = await axios.delete(`${url}/schools/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
}

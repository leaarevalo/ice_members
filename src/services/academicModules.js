import axios from "axios";

const url = process.env.VUE_APP_MEMBERS_URL;

export async function getAcademicModules() {
    let token = localStorage.getItem("access_token");
    const { data } = await axios.get(`${url}/academic-modules`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
}

export async function getAcademicModule(moduleId) {
    let token = localStorage.getItem("access_token");
    const { data } = await axios.get(`${url}/academic-modules/${moduleId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
}

export async function getModuleMembers(moduleId) {
    let token = localStorage.getItem("access_token");
    const { data } = await axios.get(`${url}/academic-modules/${moduleId}/members`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
}

export async function getAcademicModulesBySchool(schoolId) {
    let token = localStorage.getItem("access_token");
    const { data } = await axios.get(`${url}/academic-modules/school/${schoolId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
}

export async function createAcademicModule(academicModule) {
    let token = localStorage.getItem("access_token");
    const { data } = await axios.post(`${url}/academic-modules`, {
        name: academicModule.name,
        description: academicModule.description,
        school: academicModule.school,
        professors: academicModule.professors,
        order: academicModule.order,
        materialLinks: academicModule.materialLinks,
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
}

export async function updateAcademicModule(academicModule) {
    let token = localStorage.getItem("access_token");
    const { data } = await axios.put(`${url}/academic-modules/${academicModule._id}`, {
        name: academicModule.name,
        description: academicModule.description,
        professors: academicModule.professors,
        order: academicModule.order,
        materialLinks: academicModule.materialLinks,
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
}

export async function deleteAcademicModule(id) {
    let token = localStorage.getItem("access_token");
    const { data } = await axios.delete(`${url}/academic-modules/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
}

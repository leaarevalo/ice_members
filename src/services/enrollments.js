import axios from "axios";

const url = process.env.VUE_APP_MEMBERS_URL;

export async function getEnrollments() {
    let token = localStorage.getItem("access_token");
    const { data } = await axios.get(`${url}/enrollments`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
}

export async function getMyEnrollments() {
    let token = localStorage.getItem("access_token");
    const { data } = await axios.get(`${url}/enrollments/my`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
}

export async function getEnrollmentsBySchool(schoolId) {
    let token = localStorage.getItem("access_token");
    const { data } = await axios.get(`${url}/enrollments/school/${schoolId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
}

export async function createEnrollment(enrollment) {
    let token = localStorage.getItem("access_token");
    const { data } = await axios.post(`${url}/enrollments`, {
        studentDocument: enrollment.studentDocument,
        school: enrollment.school,
        academicModules: enrollment.academicModules,
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
}

export async function deleteEnrollment(id) {
    let token = localStorage.getItem("access_token");
    const { data } = await axios.delete(`${url}/enrollments/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
}

export async function updateModuleResult(enrollmentId, moduleResult) {
    let token = localStorage.getItem("access_token");
    const { data } = await axios.put(`${url}/enrollments/${enrollmentId}/module-result`, moduleResult, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
}

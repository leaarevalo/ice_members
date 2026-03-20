import axios from "axios";

const url = process.env.VUE_APP_MEMBERS_URL;

export async function createSubmission(submission) {
    let token = localStorage.getItem("access_token");
    const { data } = await axios.post(`${url}/submissions`, {
        academicModule: submission.academicModule,
        fileUrl: submission.fileUrl,
        fileName: submission.fileName,
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
}

export async function getMySubmissions() {
    let token = localStorage.getItem("access_token");
    const { data } = await axios.get(`${url}/submissions/my`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
}

export async function getSubmissionsByModule(moduleId) {
    let token = localStorage.getItem("access_token");
    const { data } = await axios.get(`${url}/submissions/module/${moduleId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
}

export async function reviewSubmission(id, review) {
    let token = localStorage.getItem("access_token");
    const { data } = await axios.put(`${url}/submissions/${id}/review`, {
        status: review.status,
        feedback: review.feedback,
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
}

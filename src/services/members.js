import axios from "axios";

const url = process.env.VUE_APP_MEMBERS_URL;
const token = localStorage.getItem("token");
export async function getMembers() {
  let token = localStorage.getItem("token");
  const { data } = await axios.get(`${url}/members`, {
    headers: {
      Authorization: `${token}`,
    },
  
  });
  return data;
}

export async function createNewMember(member) {
  axios.post(`${url}/members/create`, {
    name: member.name,
    lastName: member.lastName,
    phone: member.phone,
    dateOfBirth: member.dateOfBirth,
  }, {
    headers: {
      Authorization: `${token}`,
    },
  
  });
}

export async function updateMember(member) {
  axios.post(`${url}/members/update`, { member }, {
    headers: {
      Authorization: `${token}`,
    },
  
  });
}

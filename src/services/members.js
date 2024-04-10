import axios from "axios";

const url = process.env.VUE_APP_MEMBERS_URL;

export async function getMembers() {
  const { data } = await axios.get(`${url}/members`);
  return data;
}

export async function createNewMember(member) {
  axios.post(`${url}/members/create`, {
    name: member.name,
    lastName: member.lastName,
    phone: member.phone,
    dateOfBirth: member.dateOfBirth,
  });
}

export async function updateMember(member) {
  console.log("member", member);
  axios.post(`${url}/members/update`, { member });
}

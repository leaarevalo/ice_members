import axios from "axios";

//const url = process.env.MEMBERS_URL;
const url = "http://localhost:3000";

export async function getMembers() {
  const { data } = await axios.get(`${url}/members`);
  console.log("data", data);
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
  axios.post(`${url}/members/update`, { member });
}

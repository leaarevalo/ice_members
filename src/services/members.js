import axios from "axios";

const url = process.env.MEMBERS_URL;

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

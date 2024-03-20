import axios from "axios";

const url = "https://ice-members.onrender.com";

console.log("proccess", process.env);

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

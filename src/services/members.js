import axios from "axios";

const url = '';

export async function createMember(member) {
  return axios.post(`${url}/members`, member);
}
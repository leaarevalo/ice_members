import axios from "axios";

const url = process.env.VUE_APP_MEMBERS_URL;

export async function getMembers() {
  let token = localStorage.getItem("access_token");
  const { data } = await axios.get(`${url}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },

  });
  return data;
}

export async function createNewMember(member) {
  let token = localStorage.getItem("access_token");
  const { data } = await axios.post(`${url}/users`, {
    document: member.document,
    name: member.name,
    lastName: member.lastName,
    email: member.email,
    dateOfBirth: member.dateOfBirth,
    dateOfConversion: member.dateOfConversion,
    phone: member.phone,
    address: member.address,
    civilState: member.civilState,
    marriageDate: member.marriageDate,
    belongToCelula: member.belongToCelula,
    belongToGroup: member.belongToGroup,
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },

  });
  return data;
}

export async function updateMember(member) {
  let token = localStorage.getItem("access_token");
  const { data } = await axios.put(`${url}/users/${member._id}`, {
    document: member.document,
    name: member.name,
    lastName: member.lastName,
    email: member.email,
    dateOfBirth: member.dateOfBirth,
    dateOfConversion: member.dateOfConversion,
    phone: member.phone,
    address: member.address,
    civilState: member.civilState,
    marriageDate: member.marriageDate,
    belongToCelula: member.belongToCelula,
    belongToGroup: member.belongToGroup,
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },

  });
  return data;
}

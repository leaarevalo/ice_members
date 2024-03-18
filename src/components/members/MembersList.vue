<template>
  <div>
    <v-table>
      <thead>
        <tr>
          <th class="text-left">Nombre</th>
          <th class="text-left">Edad</th>
          <th class="text-left">Domicilio</th>
          <th class="text-left">Fecha de nacimiento</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="member in members"
          :key="member.id"
          @click="getMemberDetail(member)"
        >
          <td class="text-left">{{ member.name }}</td>
          <td class="text-left">{{ member.age }}</td>
          <td class="text-left">{{ member.address }}</td>
          <td class="text-left">{{ member.birthDate }}</td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script>
export default {
  name: "MembersList",
  setup() {
    const members = [
      {
        id: 1,
        name: "Juan",
        age: 20,
        birthDate: "1990-01-01",
        address: "Calle 1",
      },
      {
        id: 2,
        name: "Juan",
        age: 20,
        birthDate: "1990-01-01",
        address: "Calle 1",
      },
      {
        id: 3,
        name: "Juan",
        age: 20,
        birthDate: "1990-01-01",
        address: "Calle 1",
      },
      {
        id: 4,
        name: "Juan",
        age: 20,
        birthDate: "1990-01-01",
        address: "Calle 1",
      },
      {
        id: 5,
        name: "Juan",
        age: 20,
        birthDate: "1990-01-01",
        address: "Calle 1",
      },
      {
        id: 6,
        name: "Juan",
        age: 20,
        birthDate: "1990-01-01",
        address: "Calle 1",
      },
      {
        id: 7,
        name: "Juan",
        age: 20,
        birthDate: "1990-01-01",
        address: "Calle 1",
      },
    ];
    const getMemberDetail = (member) => {
      console.log(member);
    };
    return {
      members,
      getMemberDetail,
    };
  },
};
</script>

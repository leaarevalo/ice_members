<template>
  <div>
    <v-btn @click="createNewMember">Create</v-btn>
  </div>
  <div>
    <v-table>
      <thead>
        <tr>
          <th class="text-left">Nombre</th>
          <th class="text-left">Apellido</th>
          <th class="text-left">Telefono</th>
          <th class="text-left">Fecha de nacimiento</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="member in members"
          :key="member.name"
          @click="getMemberDetail(member)"
        >
          <td class="text-left">{{ member.name }}</td>
          <td class="text-left">{{ member.lastName }}</td>
          <td class="text-left">{{ member.phone }}</td>
          <td class="text-left">{{ member.dateOfBith }}</td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { getMembers } from "@/services/members";
export default {
  name: "MembersList",
  setup() {
    onMounted(async () => {
      console.log("MembersList component mounted");
      members.value = await getMembers();
      console.log("members.value: ", members.value);
    });
    const router = useRouter();
    const members = ref([]);
    const getMemberDetail = (member) => {
      console.log(member);
    };
    const createNewMember = () => {
      router.push("/members/new");
    };
    return {
      members,
      getMemberDetail,
      createNewMember,
    };
  },
};
</script>

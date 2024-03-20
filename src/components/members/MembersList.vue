<template>
  <div class="member-list_header">
    <v-responsive max-width="350px">
      <v-text-field
        label="Buscar"
        outlined
        dense
        prepend-inner-icon="mdi-magnify"
        v-model="searchValue"
      ></v-text-field>
    </v-responsive>
    <v-btn @click="createNewMember">Create</v-btn>
  </div>
  <div>
    <v-table v-show="false">
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
          v-for="member in membersList"
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
    <v-data-table
      :items="membersList"
      :headers="['Nombre', 'Apellido', 'Fecha de nacimiento', 'Celular']"
    ></v-data-table>
  </div>
</template>

<script>
import { onMounted, ref, computed } from "vue";
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
    const searchValue = ref("");
    const router = useRouter();
    const members = ref([]);

    const membersList = computed(() => {
      return searchValue.value
        ? members.value.filter((member) =>
            member.name.toLowerCase().includes(searchValue.value.toLowerCase())
          )
        : members.value;
    });

    const getMemberDetail = (member) => {
      console.log(member);
    };
    const createNewMember = () => {
      router.push("/members/new");
    };
    return {
      members,
      searchValue,
      membersList,
      getMemberDetail,
      createNewMember,
    };
  },
};
</script>

<style lang="scss">
.member-list_header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  height: 60px;
}
</style>

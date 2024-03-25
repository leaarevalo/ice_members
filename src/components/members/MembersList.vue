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
    <v-data-table
      :items="membersList"
      items-per-page="25"
      item-value="name"
      height="500"
      :headers="tableHeaders"
      @click:row="getMemberDetail"
    >
    </v-data-table>
  </div>
</template>

<script>
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { getMembers } from "@/services/members";
import { useMemberStore } from "@/store/member";
export default {
  name: "MembersList",
  setup() {
    onMounted(async () => {
      console.log("MembersList component mounted");
      members.value = await getMembers();
      console.log("members.value: ", members.value);
    });
    const store = useMemberStore();
    const searchValue = ref("");
    const router = useRouter();
    const members = ref([]);
    const tableHeaders = [
      { text: "Nombre", value: "name" },
      { text: "Apellido", value: "lastName" },
      { text: "Telefono", value: "phone" },
      { text: "Fecha de nacimiento", value: "dateOfBirth" },
    ];

    const membersList = computed(() => {
      return searchValue.value
        ? members.value.filter((member) =>
            member.name.toLowerCase().includes(searchValue.value.toLowerCase())
          )
        : members.value;
    });

    const getMemberDetail = (event, row) => {
      const member = row.item;
      store.setSelectedMember(member);
      router.push(`/members/detail`);
    };
    const createNewMember = () => {
      router.push("/members/new");
    };
    return {
      members,
      searchValue,
      membersList,
      tableHeaders,
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

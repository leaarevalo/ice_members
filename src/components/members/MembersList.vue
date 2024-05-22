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
    <v-btn @click="createNewMember">Nuevo miembro</v-btn>
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
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useMemberStore } from "@/store/member";
export default {
  name: "MembersList",
  setup() {
    let store = useMemberStore();

    const searchValue = ref("");
    const router = useRouter();
    const members = ref([]);
    const setLocalMembers = () => {
      const members = store?.getMembersFromStore;
      members.value = members.membersOperations;
      return members;
    };

    onMounted(() => {
      members.value = setLocalMembers();
    });

    watch(
      store,
      () => {
        members.value = setLocalMembers();
      },
      { deep: true }
    );

    const tableHeaders = [
      { text: "Nombre", value: "name" },
      { text: "Apellido", value: "lastName" },
      { text: "Telefono", value: "phone" },
      { text: "Fecha de nacimiento", value: "dateOfBirth" },
    ];

    const membersList = computed(() => {
      if (!members.value) return [];
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

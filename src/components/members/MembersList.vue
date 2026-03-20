<template>
  <div class="members-page">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Miembros</h1>
        <p class="page-subtitle">Gestión de miembros de la iglesia</p>
      </div>
      <v-btn
        v-if="!isUser"
        color="primary"
        prepend-icon="mdi-plus"
        class="new-member-btn"
        @click="createNewMember"
      >
        Nuevo miembro
      </v-btn>
    </div>

    <!-- Search -->
    <v-card class="search-card">
      <div class="search-wrapper">
        <v-text-field
          v-model="searchValue"
          label="Buscar por nombre..."
          prepend-inner-icon="mdi-magnify"
          hide-details
          single-line
          class="search-input"
        ></v-text-field>
      </div>

      <!-- Data Table -->
      <v-data-table
        :items="membersList"
        :loading="loading"
        items-per-page="25"
        item-value="name"
        :headers="tableHeaders"
        @click:row="getMemberDetail"
        class="members-table"
        hover
      >
        <template #item.dateOfBirth="{ item }">
          {{ formatDate(item.dateOfBirth) }}
        </template>
        <template #item.dateOfConversion="{ item }">
          {{ formatDate(item.dateOfConversion) }}
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useMemberStore } from "@/store/member";
import { getMembers } from "@/services/members";
export default {
  name: "MembersList",
  setup() {
    let store = useMemberStore();
    const isUser = !store.isManager && !store.isLider;

    const searchValue = ref("");
    const router = useRouter();
    const members = ref([]);
    const loading = ref(false);

    const fetchMembers = async () => {
      try {
        loading.value = true;
        const membersData = await getMembers();
        members.value = membersData;
        store.setMembers(membersData);
      } catch (error) {
        console.error('Error fetching members:', error);
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      const storeMembers = store.getMembersFromStore;
      if (storeMembers && storeMembers.length > 0) {
        members.value = storeMembers;
      } else {
        fetchMembers();
      }
    });

    const tableHeaders = [
      { text: "Documento", value: "document" },
      { text: "Nombre", value: "name" },
      { text: "Email", value: "email" },
      { text: "Fecha de nacimiento", value: "dateOfBirth" },
      { text: "Fecha de conversión", value: "dateOfConversion" },
    ];

    const membersList = computed(() => {
      if (!members.value) return [];
      return searchValue.value
        ? members.value.filter((member) => {
          return member.name.toLowerCase().includes(searchValue.value.toLowerCase())
    })
        : members.value;
    });

    const getMemberDetail = (_, row) => {
      const member = row.item;
      store.setSelectedMember(member);
      router.push(`/members/detail`);
    };
    const createNewMember = () => {
      router.push("/members/new");
    };

    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES');
    };

    return {
      members,
      searchValue,
      membersList,
      tableHeaders,
      getMemberDetail,
      createNewMember,
      loading,
      formatDate,
      isUser,
    };
  },
};
</script>

<style lang="scss" scoped>
.members-page {
  max-width: 1100px;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1A1918;
  letter-spacing: -0.03em;
  margin-bottom: 2px;
}

.page-subtitle {
  font-size: 0.9rem;
  color: #6B6560;
  margin: 0;
}

.new-member-btn {
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0;
}

.search-card {
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04) !important;
  overflow: hidden;
}

.search-wrapper {
  padding: 20px 24px 12px;
}

.search-input {
  max-width: 380px;
}

.members-table {
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.members-table :deep(tr) {
  cursor: pointer;
}

.members-table :deep(th) {
  background-color: #F5F3EF !important;
  font-weight: 600 !important;
  color: #6B6560 !important;
  font-size: 0.8rem !important;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
</style>

<template>
  <v-row>
    <v-col cols="12">
      <v-card>
        <v-card-title class="text-center">
          Bienvenido
        </v-card-title>
      </v-card>
    </v-col>
  </v-row>
  <v-row>
    <v-data-table :items="members" items-per-page="25" item-value="name" height="500" :headers="tableHeaders">
    </v-data-table>

  </v-row>
</template>
<script>
import { onMounted, ref } from "vue";
import { getMembers } from "@/services/members";
import { useMemberStore } from "@/store/member";

export default {
  name: "Home",
  setup() {
    const store = useMemberStore();
    onMounted(async () => {
      console.log("Home component mounted");
      const members = await getMembers();
      store.setMembers(members)
      console.log("members: ", members);
    });
    //const members = ref([]);
    
    // const tableHeaders = [
    //   { text: "Nombre", value: "name" },
    //   { text: "Apellido", value: "lastName" },
    //   { text: "Telefono", value: "phone" },
    //   { text: "Fecha de nacimiento", value: "dateOfBirth" },
    // ];
    return {
      //tableHeaders,
      //members
    }
  }
}


</script>
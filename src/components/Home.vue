<template>
  <v-container>
  <v-row>
    <v-card class="mx-auto pa-16 pb-8" elevation="4" max-width="448" rounded="lg">
      <v-img :width="202" aspect-ratio="16/9" cover
          src="https://iglesiadecristotuc.org.ar/media/imagen/top_bar/logo.png">
      </v-img>
      <v-card-text>
        Bienvenidos
      </v-card-text>
      <v-card-subtitle> Cantidad de miembros: </v-card-subtitle>

    </v-card>
  </v-row>
  <!-- <v-row>
    <v-data-table :items="members" items-per-page="25" item-value="name" height="500" :headers="tableHeaders">
    </v-data-table>

  </v-row> -->
</v-container>
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
<template>
  <v-sheet>
    <h1>Registrar miembro</h1>
    <v-form ref="form">
      <v-container>
        <v-row>
          <v-col cols="6" md="6">
            <v-text-field
              v-model="member.name"
              label="Nombre"
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="6" md="6">
            <v-text-field
              v-model="member.lastName"
              label="Apellido"
              variant="outlined"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6" md="6">
            <v-text-field
              v-model="member.phone"
              label="Telefono"
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="6" md="6">
            <v-text-field
              v-model="member.email"
              label="Email"
              variant="outlined"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6" md="6">
            <v-text-field
              v-model="member.civilState"
              label="Estado civil"
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="6" md="6">
            <v-text-field
              v-model="member.marriageDate"
              label="Fecha de casamiento"
              variant="outlined"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6" md="6">
            <v-text-field
              v-model="member.belongToCelula"
              label="Celula a la que pertenece"
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="6" md="6">
            <v-text-field
              v-model="member.belongToGroup"
              label="Grupo al que pertenece"
              variant="outlined"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6" md="6">
            <v-text-field
              v-model="member.address"
              label="Direccion"
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="6" md="6">
            <v-text-field
              v-model="member.dateOfBirth"
              label="Fecha de nacimiento"
              placeholder="dd/mm/aaaa"
              variant="outlined"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
      <div class="button-footer">
        <v-btn @click="goBack">Volver</v-btn>
        <v-btn @click="createMember">Guardar</v-btn>
      </div>
    </v-form>
  </v-sheet>
</template>

<script>
import { ref } from "vue";
import { createNewMember } from "@/services/members";
import { useMemberStore } from "@/store/member";
import { useRouter } from "vue-router";
export default {
  name: "MemberDetail",
  setup() {
    const router = useRouter();
    const store = useMemberStore();
    const member = ref({
      name: "",
      lastName: "",
      dateOfBirth: "",
      phone: "",
    });
    const createMember = async () => {
      try {
        const newMember = { ...member.value };
        const response = await createNewMember(newMember);
        store.addNewMember(response);
        router.push("/members");
      } catch (err) {
        console.log("error", err);
      }
    };
    const goBack = () => {
      window.history.back();
    };
    return {
      member,
      createMember,
      goBack,
    };
  },
};
</script>

<style lang="scss">
.button-footer {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}
</style>

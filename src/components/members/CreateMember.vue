<template>
  <v-sheet>
    <h1>Member Detail</h1>
    <v-form ref="form">
      <v-container>
        <v-row>
          <v-col cols="12" md="12">
            <v-text-field
              v-model="member.name"
              label="Nombre"
              outlined
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="12">
            <v-text-field
              v-model="member.lastName"
              label="Apellido"
              outlined
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="12">
            <v-text-field
              v-model="member.dateOfBirth"
              label="Fecha de nacimiento"
              outlined
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="12">
            <v-text-field
              v-model="member.phone"
              label="Telefono"
              outlined
              dense
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
export default {
  name: "MemberDetail",
  setup() {
    const member = ref({
      name: "",
      lastName: "",
      dateOfBirth: "",
      phone: "",
    });
    const createMember = async () => {
      console.log("member", member.value);
      const newMember = { ...member.value };
      await createNewMember(newMember);
    };
    const goBack = () => {
      window.history.back();
    };
    return {
      member,
      createMember,
      goBack
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

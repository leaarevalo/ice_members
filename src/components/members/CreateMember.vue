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
      <v-btn @click="createMember">Guardar</v-btn>
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
    return {
      member,
      createMember,
    };
  },
};
</script>

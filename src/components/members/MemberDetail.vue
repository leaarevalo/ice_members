<template>
  <v-sheet>
    <h1>Member Detail</h1>
    <v-form ref="form">
      <v-container>
        <v-row>
          <v-col cols="6" md="6">
            <v-text-field
              v-model="memberDetail.name"
              label="Nombre"
              outlined
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="6" md="6">
            <v-text-field
              v-model="memberDetail.lastName"
              label="Apellido"
              outlined
              dense
            >
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6" md="6">
            <v-text-field
              v-model="memberDetail.phone"
              label="Telefono"
              outlined
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="6" md="6">
            <v-text-field
              v-model="memberDetail.email"
              label="Email"
              outlined
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6" md="6">
            <v-text-field
              v-model="memberDetail.civilState"
              label="Estado civil"
              outlined
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="6" md="6">
            <v-text-field
              v-model="memberDetail.marriageDate"
              label="Fecha de matrimonio"
              outlined
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6" md="6">
            <v-text-field
              v-model="memberDetail.belongToCelula"
              label="Celula a la que pertenece"
              outlined
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="6" md="6">
            <v-text-field
              v-model="memberDetail.belongToGroup"
              label="Grupo al que pertenece"
              outlined
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="12">
            <v-text-field
              v-model="memberDetail.address"
              label="Address"
              outlined
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="12">
            <v-textarea
              v-model="memberDetail.history"
              label="Historial de consejería"
              outlined
              dense
            ></v-textarea>
          </v-col>
        </v-row>
      </v-container>
      <div class="button-footer">
        <v-btn @click="goBack">Volver</v-btn>
        <v-btn @click="saveMemberInformation">Guardar cambios</v-btn>
      </div>
    </v-form>
  </v-sheet>
</template>

<script>
import { ref } from "vue";
import { updateMember } from "@/services/members";
import { useMemberStore } from "@/store/member";
export default {
  name: "MemberDetail",
  props: {
    member: {
      type: Object,
      required: false,
    },
  },
  setup() {
    const store = useMemberStore();
    const memberDetail = ref(store.getSelectedMember);

    const saveMemberInformation = async () => {
      const response = await updateMember(memberDetail.value);
      console.log(response);
    };
    const goBack = () => {
      store.setSelectedMember(null);
      window.history.back();
    };
    return {
      memberDetail,
      saveMemberInformation,
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

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
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="6" md="6">
            <v-text-field
              v-model="memberDetail.lastName"
              label="Apellido"
              variant="outlined"
            >
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6" md="6">
            <v-text-field
              v-model="memberDetail.phone"
              label="Telefono"
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="6" md="6">
            <v-text-field
              v-model="memberDetail.email"
              label="Email"
              variant="outlined"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6" md="6">
            <v-text-field
              v-model="memberDetail.civilState"
              label="Estado civil"
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="6" md="6">
            <v-text-field
              v-model="memberDetail.marriageDate"
              label="Fecha de matrimonio"
              variant="outlined"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6" md="6">
            <v-text-field
              v-model="memberDetail.belongToCelula"
              label="Celula a la que pertenece"
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="6" md="6">
            <v-text-field
              v-model="memberDetail.belongToGroup"
              label="Grupo al que pertenece"
              variant="outlined"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6" md="6">
            <v-text-field
              v-model="memberDetail.dateOfBirth"
              label="Fecha de nacimiento"
              placeholder=""
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="6" md="6">
            <v-text-field
              v-model="memberDetail.address"
              label="Address"
              variant="outlined"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="12" v-if="userTypeParsed === 'manager'">
            <v-textarea
              v-model="memberDetail.history"
              label="Historial de consejería"
              variant="outlined"
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
import { useRouter } from "vue-router";
import { userTypes } from "@/utils/constants";
export default {
  name: "MemberDetail",
  props: {
    member: {
      type: Object,
      required: false,
    },
  },
  setup() {
    const router = useRouter();
    const store = useMemberStore();
    const memberDetail = ref(store.getSelectedMember);
    const userType = ref(store.getUserType);
    const userTypeParsed = userTypes[userType.value];
    const saveMemberInformation = async () => {
      // TODO agregar opcion en caso de que falle el update
      await updateMember(memberDetail.value);
      store.updateMember(memberDetail.value);
      router.push("/members");
    };
    const goBack = () => {
      store.setSelectedMember(null);
      window.history.back();
    };
    return {
      memberDetail,
      userTypeParsed,
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

<template>
  <v-sheet>
    <h1>Member Detail</h1>
    <v-form ref="form">
      <v-container>
        <v-row>
          <v-col cols="12" md="12">
            <v-text-field
              v-model="member.name"
              label="Name"
              outlined
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="12">
            <v-text-field
              v-model="member.age"
              label="Age"
              outlined
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="12">
            <v-text-field
              v-model="member.address"
              label="Address"
              outlined
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="12">
            <v-textarea
              v-model="member.history"
              label="Historial de consejería"
              outlined
              dense
            ></v-textarea>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </v-sheet>
</template>

<script>
export default {
  name: "MemberDetail",
  setup() {
    const member = {
      id: 1,
      name: "Juan",
      age: 20,
      address: "Calle 1",
    };
    return {
      member,
    };
  },
};
</script>

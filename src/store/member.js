import { defineStore } from "pinia";

export const useMemberStore = defineStore("member", {
  state: () => ({
    members: [],
    selectedMember: {},
  }),
  getters: {
    getSelectedMember() {
      return this.selectedMember;
    },
  },
  actions: {
    setSelectedMember(member) {
      this.selectedMember = member;
    },
    setMembers(members){
      this.members = members
    }
  },
});

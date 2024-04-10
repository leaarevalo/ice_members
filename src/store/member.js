import { defineStore } from "pinia";

export const useMemberStore = defineStore("member", {
  state: () => {
    return {
      membersOperations: [],
      selectedMember: {},
    };
  },
  persist: {
    key: "member",
  },
  getters: {
    getSelectedMember() {
      return this.selectedMember;
    },
    getMembersFromStore() {
      console.log("this.members", this.membersOperations);
      return this.membersOperations;
    },
  },
  actions: {
    setSelectedMember(member) {
      this.selectedMember = member;
    },
    setMembers(members) {
      this.membersOperations = members;
    },
  },
});

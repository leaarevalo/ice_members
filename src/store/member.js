import { defineStore } from "pinia";

export const useMemberStore = defineStore("member", {
  state: () => {
    return {
      membersOperations: [],
      selectedMember: {},
      user: {},
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
    getMembersCount() {
      return this.membersOperations.length;
    },
    getUserType() {
      return this.user.type;
    },
  },
  actions: {
    setSelectedMember(member) {
      this.selectedMember = member;
    },
    setMembers(members) {
      this.membersOperations = members;
    },
    addNewMember(member) {
      if(member) {
        this.membersOperations.push(member);
      }
    },
    updateMember(member) {
      const { name, _id } = member;
      console.table({ name, _id });
      console.log("member", member);
      const index = this.membersOperations.findIndex((m) => m._id === member._id);
      this.membersOperations.splice(index, 1, member);
    },
    setUser(user) {
      this.user = user;
    },
    removeUser() {
      this.user = {};
    }
  },
});

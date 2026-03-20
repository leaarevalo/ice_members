import { defineStore } from "pinia";

export const useMemberStore = defineStore("member", {
  state: () => {
    return {
      membersOperations: [],
      selectedMember: {},
      user: {},
      professorFlag: false,
      studentFlag: false,
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
      return this.membersOperations;
    },
    getMembersCount() {
      return this.membersOperations.length;
    },
    getUser() {
      return this.user;
    },
    getUserType() {
      return this.user.type;
    },
    isManager() {
      return this.user.role === 'manager';
    },
    isCounselor() {
      return this.user.role === 'counselor';
    },
    isLider() {
      return this.user.role === 'lider';
    },
    getAssignedGroups() {
      return this.user.assignedGroups || [];
    },
    isAuthenticated() {
      return this.user && Object.keys(this.user).length > 0;
    },
    isProfessor() {
      return this.professorFlag;
    },
    isStudent() {
      return this.studentFlag;
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
      if (member) {
        this.membersOperations.push(member);
      }
    },
    updateMember(member) {
      const { name, _id } = member;
      console.table({ name, _id });
      const index = this.membersOperations.findIndex((m) => m._id === member._id);
      this.membersOperations.splice(index, 1, member);
    },
    setUser(user) {
      console.log('Setting user in store:', user);
      this.user = user;
      console.log('User set in store state:', this.user);
    },
    removeUser() {
      this.user = {};
      this.professorFlag = false;
      this.studentFlag = false;
    },
    setProfessor(value) {
      this.professorFlag = value;
    },
    setStudent(value) {
      this.studentFlag = value;
    },
    initializeUser() {
      // This action will be called to ensure user is loaded from persisted state
      console.log('Initializing user from store:', this.user);
      return this.user;
    }
  },
});

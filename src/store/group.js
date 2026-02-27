import { defineStore } from "pinia";

export const useGroupStore = defineStore("group", {
    state: () => {
        return {
            groups: [],
            selectedGroup: null,
        };
    },
    persist: {
        key: "group",
    },
    getters: {
        getSelectedGroup() {
            return this.selectedGroup;
        },
        getGroupsFromStore() {
            return this.groups;
        },
        getGroupsCount() {
            return this.groups.length;
        },
    },
    actions: {
        setSelectedGroup(group) {
            this.selectedGroup = group;
        },
        setGroups(groups) {
            this.groups = groups;
        },
        addNewGroup(group) {
            if (group) {
                this.groups.push(group);
            }
        },
        updateGroup(group) {
            const index = this.groups.findIndex((g) => g._id === group._id);
            if (index !== -1) {
                this.groups.splice(index, 1, group);
            }
        },
        deleteGroup(id) {
            this.groups = this.groups.filter((g) => g._id !== id);
        },
    },
});

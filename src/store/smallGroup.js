import { defineStore } from "pinia";

export const useSmallGroupStore = defineStore("smallGroup", {
    state: () => {
        return {
            smallGroups: [],
            selectedSmallGroup: null,
            selectedParentGroup: null, // to carry over the parent group if needed
        };
    },
    persist: {
        key: "smallGroup",
    },
    getters: {
        getSelectedSmallGroup() {
            return this.selectedSmallGroup;
        },
        getSelectedParentGroup() {
            return this.selectedParentGroup;
        },
        getSmallGroupsFromStore() {
            return this.smallGroups;
        },
    },
    actions: {
        setSelectedSmallGroup(smallGroup) {
            this.selectedSmallGroup = smallGroup;
        },
        setSelectedParentGroup(group) {
            this.selectedParentGroup = group;
        },
        setSmallGroups(smallGroups) {
            this.smallGroups = smallGroups;
        },
        updateSmallGroup(smallGroup) {
            const index = this.smallGroups.findIndex((sg) => sg._id === smallGroup._id);
            if (index !== -1) {
                this.smallGroups.splice(index, 1, smallGroup);
            }
        },
    },
});

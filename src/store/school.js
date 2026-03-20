import { defineStore } from "pinia";

export const useSchoolStore = defineStore("school", {
    state: () => {
        return {
            schools: [],
            selectedSchool: null,
        };
    },
    persist: {
        key: "school",
    },
    getters: {
        getSelectedSchool() {
            return this.selectedSchool;
        },
        getSchoolsFromStore() {
            return this.schools;
        },
        getSchoolsCount() {
            return this.schools.length;
        },
    },
    actions: {
        setSelectedSchool(school) {
            this.selectedSchool = school;
        },
        setSchools(schools) {
            this.schools = schools;
        },
        addNewSchool(school) {
            if (school) {
                this.schools.push(school);
            }
        },
        updateSchool(school) {
            const index = this.schools.findIndex((s) => s._id === school._id);
            if (index !== -1) {
                this.schools.splice(index, 1, school);
            }
        },
        deleteSchool(id) {
            this.schools = this.schools.filter((s) => s._id !== id);
        },
    },
});

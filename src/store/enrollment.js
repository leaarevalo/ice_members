import { defineStore } from "pinia";

export const useEnrollmentStore = defineStore("enrollment", {
    state: () => {
        return {
            enrollments: [],
            selectedEnrollment: null,
            selectedModule: null,
        };
    },
    persist: {
        key: "enrollment",
    },
    getters: {
        getSelectedEnrollment() {
            return this.selectedEnrollment;
        },
        getEnrollmentsFromStore() {
            return this.enrollments;
        },
        getSelectedModule() {
            return this.selectedModule;
        },
    },
    actions: {
        setSelectedEnrollment(enrollment) {
            this.selectedEnrollment = enrollment;
        },
        setEnrollments(enrollments) {
            this.enrollments = enrollments;
        },
        addNewEnrollment(enrollment) {
            if (enrollment) {
                this.enrollments.push(enrollment);
            }
        },
        setSelectedModule(mod) {
            this.selectedModule = mod;
        },
        deleteEnrollment(id) {
            this.enrollments = this.enrollments.filter((e) => e._id !== id);
        },
    },
});

<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="600">
    <v-card rounded="xl" v-if="submission">
      <v-card-title class="dialog-title">
        Detalle de entrega
      </v-card-title>
      <v-card-text class="pt-4">
        <div class="detail-grid">
          <div class="detail-item">
            <span class="detail-label">Alumno</span>
            <span class="detail-value">
              {{ submission.student?.name ? `${submission.student.name} ${submission.student.lastName || ''}`.trim() : submission.student }}
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Módulo</span>
            <span class="detail-value">{{ submission.academicModule?.name || submission.academicModule }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Archivo</span>
            <span class="detail-value">
              <a v-if="submission.fileUrl" :href="submission.fileUrl" target="_blank" class="file-link">
                {{ submission.fileName || 'Ver archivo' }}
              </a>
              <span v-else class="text-medium-emphasis">Sin archivo</span>
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Estado</span>
            <v-chip :color="statusColor" size="small" variant="tonal">
              {{ statusLabel }}
            </v-chip>
          </div>
          <div class="detail-item" v-if="submission.reviewedBy">
            <span class="detail-label">Revisado por</span>
            <span class="detail-value">
              {{ submission.reviewedBy?.name ? `${submission.reviewedBy.name} ${submission.reviewedBy.lastName || ''}`.trim() : submission.reviewedBy }}
            </span>
          </div>
          <div class="detail-item" v-if="submission.reviewedAt">
            <span class="detail-label">Fecha de revisión</span>
            <span class="detail-value">{{ new Date(submission.reviewedAt).toLocaleDateString('es-AR') }}</span>
          </div>
        </div>

        <!-- Review section -->
        <div v-if="isManager || submission.status === 'pending_review'" class="review-section mt-6">
          <h4 class="review-title">Revisión</h4>
          <v-select
            v-model="reviewStatus"
            :items="reviewStatuses"
            label="Estado"
            :readonly="!isManager"
          ></v-select>
          <v-textarea
            v-model="reviewFeedback"
            label="Feedback / Comentarios"
            rows="3"
            :readonly="!isManager"
          ></v-textarea>
        </div>

        <!-- Existing feedback (read-only) -->
        <div v-if="submission.feedback && !isManager" class="review-section mt-6">
          <h4 class="review-title">Feedback del profesor</h4>
          <p class="feedback-text">{{ submission.feedback }}</p>
        </div>
      </v-card-text>
      <v-card-actions class="dialog-actions">
        <v-btn variant="outlined" color="secondary" @click="close">Cerrar</v-btn>
        <v-btn v-if="isManager" color="primary" :loading="saving" @click="submitReview">
          Guardar revisión
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref, computed, watch } from "vue";
import { reviewSubmission } from "@/services/submissions";

export default {
  name: "SubmissionDetailDialog",
  props: {
    modelValue: Boolean,
    submission: Object,
    isManager: Boolean,
  },
  emits: ["update:modelValue", "reviewed"],
  setup(props, { emit }) {
    const saving = ref(false);
    const reviewStatus = ref("pending_review");
    const reviewFeedback = ref("");

    const reviewStatuses = [
      { title: "Pendiente de revisión", value: "pending_review" },
      { title: "Aprobado", value: "approved" },
      { title: "Rechazado", value: "rejected" },
    ];

    watch(() => props.modelValue, (open) => {
      if (open && props.submission) {
        reviewStatus.value = props.submission.status || "pending_review";
        reviewFeedback.value = props.submission.feedback || "";
      }
    });

    const statusColor = computed(() => {
      const map = { pending_review: "warning", approved: "success", rejected: "error" };
      return map[props.submission?.status] || "secondary";
    });

    const statusLabel = computed(() => {
      const map = { pending_review: "Pendiente", approved: "Aprobado", rejected: "Rechazado" };
      return map[props.submission?.status] || props.submission?.status;
    });

    const close = () => {
      emit("update:modelValue", false);
    };

    const submitReview = async () => {
      if (!props.submission) return;
      try {
        saving.value = true;
        await reviewSubmission(props.submission._id, {
          status: reviewStatus.value,
          feedback: reviewFeedback.value,
        });
        emit("reviewed");
        close();
      } catch (err) {
        console.error("Error reviewing submission:", err);
      } finally {
        saving.value = false;
      }
    };

    return {
      saving, reviewStatus, reviewFeedback, reviewStatuses,
      statusColor, statusLabel, close, submitReview,
    };
  },
};
</script>

<style lang="scss" scoped>
.dialog-title {
  padding: 20px 24px !important;
  font-size: 1.25rem !important;
  font-weight: 600 !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.dialog-actions {
  padding: 16px 24px !important;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  justify-content: flex-end;
  gap: 8px;
}

.dialog-actions .v-btn {
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6B6560;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.detail-value {
  font-size: 0.9rem;
  color: #1A1918;
}

.file-link {
  color: #D97706;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
}

.review-section {
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  padding-top: 16px;
}

.review-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1A1918;
  margin-bottom: 12px;
}

.feedback-text {
  color: #1A1918;
  line-height: 1.6;
  background: #F5F3EF;
  padding: 12px 16px;
  border-radius: 12px;
}
</style>

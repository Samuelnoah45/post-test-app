<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    modal
    :header="isCreate ? 'Create Post' : 'Edit Post'"
    :style="{ width: '32rem' }"
  >
    <Form
      :validation-schema="validationSchema"
      :initial-values="formValues"
      @submit="handleSubmit as any"
      v-slot="{ errors }"
    >
      <div class="space-y-4">
        <div>
          <label for="title" class="block text-sm font-medium mb-1"
            >Title</label
          >
          <Field name="title" v-slot="{ field, errorMessage }">
            <InputText
              v-bind="field"
              id="title"
              class="w-full"
              :class="{ 'border-red-500': errorMessage }"
              placeholder="Enter post title"
            />
          </Field>
          <ErrorMessage name="title" class="text-red-500 text-xs mt-1 block" />
        </div>

        <div>
          <label for="body" class="block text-sm font-medium mb-1">Body</label>
          <Field name="body" v-slot="{ field, errorMessage }">
            <Textarea
              v-bind="field"
              id="body"
              rows="5"
              class="w-full"
              :class="{ 'border-red-500': errorMessage }"
              placeholder="Enter post content"
            />
          </Field>
          <ErrorMessage name="body" class="text-red-500 text-xs mt-1 block" />
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <Button
            label="Cancel"
            severity="secondary"
            text
            @click="handleCancel"
          />
          <Button
            label="Save"
            icon="pi pi-check"
            type="submit"
            :disabled="Object.keys(errors).length > 0"
          />
        </div>
      </div>
    </Form>
  </Dialog>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import { Form, Field, ErrorMessage } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { postSchema, type PostFormData } from "../../validation/postSchema";

interface Props {
  visible: boolean;
  isCreate: boolean;
  initialData?: PostFormData;
}

interface Emits {
  (e: "update:visible", value: boolean): void;
  (e: "submit", data: PostFormData): void;
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  isCreate: true,
  initialData: () => ({ title: "", body: "" }),
});

const emit = defineEmits<Emits>();

const validationSchema = toTypedSchema(postSchema);

const formValues = computed(() => ({
  title: props.initialData?.title || "",
  body: props.initialData?.body || "",
}));

function handleSubmit(values: PostFormData) {
  emit("submit", values);
}

function handleCancel() {
  emit("update:visible", false);
}
</script>

<style scoped></style>

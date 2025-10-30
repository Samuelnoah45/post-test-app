<template>
  <div class="relative">
    <Button
      label="Columns"
      icon="pi pi-table"
      severity="secondary"
      @click="toggleDropdown"
      :aria-expanded="visible"
      aria-label="Select columns to display"
    />

    <div
      v-if="visible"
      class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
    >
      <div class="p-3 border-b border-gray-200">
        <h3 class="text-sm font-semibold text-gray-700">Display Columns</h3>
      </div>

      <div class="p-2 space-y-1 max-h-64 overflow-y-auto">
        <div
          v-for="column in columnsStore.columns"
          :key="column.key"
          class="flex items-center p-2 hover:bg-gray-50 rounded transition-colors"
        >
          <Checkbox
            v-model="column.visible"
            :binary="true"
            :inputId="`col-${column.key}`"
            @change="handleColumnChange"
          />
          <label
            :for="`col-${column.key}`"
            class="ml-2 text-sm cursor-pointer select-none flex-1"
          >
            {{ column.label }}
          </label>
        </div>
      </div>

      <div class="p-2 border-t border-gray-200 flex gap-2">
        <Button
          label="All"
          size="small"
          severity="secondary"
          text
          class="flex-1"
          @click="columnsStore.showAllColumns()"
        />
        <Button
          label="None"
          size="small"
          severity="secondary"
          text
          class="flex-1"
          @click="columnsStore.hideAllColumns()"
        />
      </div>
    </div>

    <!-- Backdrop to close dropdown when clicking outside -->
    <div
      v-if="visible"
      class="fixed inset-0 z-40"
      @click="visible = false"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import Button from "primevue/button";
import Checkbox from "primevue/checkbox";
import { useColumnsStore } from "../../stores/columns";

const columnsStore = useColumnsStore();
const visible = ref(false);

const STORAGE_KEY = "posts-columns-visibility";

function toggleDropdown() {
  visible.value = !visible.value;
}

function handleColumnChange() {
  // Save the updated columns state to localStorage
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(columnsStore.columns));
  } catch (e) {
    console.error("Failed to save column visibility:", e);
  }
}
</script>

<style scoped>
/* Ensure dropdown appears above other elements */
</style>

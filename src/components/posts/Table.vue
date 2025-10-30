<template>
  <div class="space-y-3">
    <h2 class="text-xl font-semibold">Posts</h2>
    <div class="flex items-center justify-between gap-3">
      <div class="relative max-w-md w-full">
        <InputText
          v-model="query"
          placeholder="Filter posts..."
          class="w-[90%] pl-10 pr-10"
        />
        <Button
          v-if="query"
          text
          rounded
          size="small"
          icon="pi pi-times"
          class="!p-1 absolute right-8 text-muted-color hover:text-color z-10"
          @click="clearQuery"
          aria-label="Clear filter"
        />
      </div>
      <div class="shrink-0 flex gap-2">
        <ColumnSelector />
        <Button label="New" icon="pi pi-plus" @click="onCreate" />
      </div>
    </div>
    <DataTable
      :value="filteredRows"
      :loading="loading"
      dataKey="id"
      :rows="10"
      :paginator="true"
      responsiveLayout="scroll"
      class="rounded border"
    >
      <Column
        v-if="columnsStore.columnVisibilityMap.id"
        field="id"
        header="ID"
        style="width: 100px"
      />
      <Column
        v-if="columnsStore.columnVisibilityMap.title"
        field="title"
        header="Title"
      />
      <Column
        v-if="columnsStore.columnVisibilityMap.body"
        field="body"
        header="Body"
      />
      <Column header="Actions" style="width: 120px">
        <template #body="{ data }">
          <Button
            text
            rounded
            size="small"
            icon="pi pi-ellipsis-v"
            aria-label="Actions"
            class="!p-2 text-muted-color hover:text-color"
            @click="(e) => onActionMenu(e, data)"
          />
        </template>
      </Column>
      <template #empty>
        <div class="p-4 text-gray-500">No data found.</div>
      </template>
      <template #loading>
        <div class="p-4">Loading posts...</div>
      </template>
    </DataTable>

    <Menu ref="actionMenu" :model="actionItems" popup />
    <ConfirmDialog
      :pt="{
        root: { class: 'w-[28rem] max-w-[95vw]' },
        header: { class: 'text-lg font-semibold' },
        content: { class: 'text-base' },
        footer: { class: 'gap-2' },
      }"
    />

    <PostForm
      v-model:visible="editVisible"
      :is-create="isCreate"
      :initial-data="formInitialValues"
      @submit="onSubmit"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Menu from "primevue/menu";
import ConfirmDialog from "primevue/confirmdialog";
import { useConfirm } from "primevue/useconfirm";
import type { Post } from "../../api/post";
import { fetchPosts, updatePost, deletePost, createPost } from "../../api/post";
import ColumnSelector from "./ColumnSelector.vue";
import PostForm from "./PostForm.vue";
import { useColumnsStore } from "../../stores/columns";
import type { PostFormData } from "../../validation/postSchema";

const columnsStore = useColumnsStore();
const rows = ref<Post[]>([]);
const loading = ref<boolean>(false);
const editVisible = ref<boolean>(false);
const editForm = ref<Post | null>(null);
const isCreate = ref<boolean>(false);
const query = ref<string>("");
const actionMenu = ref();
const currentRow = ref<Post | null>(null);
const confirm = useConfirm();

// Form initial values
const formInitialValues = ref<PostFormData>({
  title: "",
  body: "",
});
const actionItems = ref([
  {
    label: "Edit",
    icon: "pi pi-pencil",
    command: () => currentRow.value && onEdit(currentRow.value),
  },
  { separator: true },
  {
    label: "Delete",
    icon: "pi pi-trash",
    command: () =>
      currentRow.value &&
      confirmDelete(
        "Confirm Delete",
        `Delete "${(currentRow.value as Post).title}"?`,
      ),
  },
]);

onMounted(async () => {
  try {
    loading.value = true;
    rows.value = await fetchPosts();
  } finally {
    loading.value = false;
  }
});

function onEdit(row: Post) {
  isCreate.value = false;
  editForm.value = { ...row };
  formInitialValues.value = {
    title: row.title || "",
    body: row.body || "",
  };
  editVisible.value = true;
}

function onCreate() {
  isCreate.value = true;
  editForm.value = { id: 0, title: "", body: "" } as Post;
  formInitialValues.value = {
    title: "",
    body: "",
  };
  editVisible.value = true;
}

function onActionMenu(event: MouseEvent, row: Post) {
  currentRow.value = row;
  actionMenu.value.toggle(event);
}

async function onSubmit(values: PostFormData) {
  const { title, body } = values;

  // Close dialog immediately
  editVisible.value = false;

  if (isCreate.value) {
    // optimistic add
    const tempId = Math.max(0, ...rows.value.map((r) => r.id)) + 1;
    const temp = { id: tempId, title, body } as Post;
    rows.value.unshift(temp);
    isCreate.value = false;
    try {
      const created = await createPost({ title, body, userId: 1 });
      // replace temp id with returned id if exists
      const idx = rows.value.findIndex((r) => r.id === tempId);
      if (idx !== -1 && created?.id) rows.value[idx].id = created.id as number;
    } catch (e) {
      // keep optimistic row; JSONPlaceholder won't persist but returns a mock
      console.error("Failed to create post:", e);
    }
  } else {
    // optimistic update
    if (!editForm.value) return;
    const id = editForm.value.id;
    const index = rows.value.findIndex((r) => r.id === id);
    if (index !== -1) {
      rows.value[index] = {
        ...(rows.value[index] as Post),
        title,
        body,
      };
    }
    try {
      await updatePost(id, { title, body });
    } catch (e) {
      console.error("Failed to update post:", e);
    }
  }
}

const filteredRows = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return rows.value;
  return rows.value.filter((r) =>
    [r.title, r.body?.toString() ?? ""].some((v) =>
      v.toLowerCase().includes(q),
    ),
  );
});

function clearQuery() {
  query.value = "";
}

function confirmDelete(title?: string, message?: string) {
  if (!currentRow.value) return;
  confirm.require({
    header: title || "Confirm",
    message: message || "Delete this post?",
    icon: "pi pi-exclamation-triangle",
    acceptLabel: "Yes",
    acceptClass: "p-button-danger",
    rejectLabel: "No",
    accept: async () => {
      const row = currentRow.value as Post;
      const idx = rows.value.findIndex((r) => r.id === row.id);
      if (idx === -1) return;
      const snapshot = rows.value[idx];
      rows.value.splice(idx, 1);
      try {
        await deletePost(row.id);
      } catch (e) {
        rows.value.splice(idx, 0, snapshot);
      }
    },
  });
}
</script>

<style></style>

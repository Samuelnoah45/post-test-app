<template>
  <div class="space-y-6">
    <PostsTable />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import PostsTable from "../components/posts/Table.vue";

export default defineComponent({
  components: {
    PostsTable,
  },
});
</script>

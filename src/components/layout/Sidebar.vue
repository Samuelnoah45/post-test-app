<template>
  <aside class="h-screen sticky top-0 w-64 border-r bg-white">
    <div class="px-4 py-4 border-b">
      <h1 class="text-xl font-semibold">Post App</h1>
    </div>
    <nav class="px-3 py-4 space-y-1">
      <RouterLink
        to="/"
        class="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-gray-700"
        active-class="bg-gray-100 font-medium"
      >
        <i class="pi pi-home" />
        <span>Home</span>
      </RouterLink>
    </nav>
  </aside>
</template>

<script lang="ts" setup>
import { RouterLink } from "vue-router";
</script>

<style></style>

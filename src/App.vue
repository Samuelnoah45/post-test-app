<template>
  <div class="min-h-screen bg-gray-50">
    <div class="flex">
      <Sidebar />
      <main class="flex-1 min-w-0">
        <div class="p-6">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Sidebar from "./components/layout/Sidebar.vue";

export default defineComponent({
  components: { Sidebar },
});
</script>

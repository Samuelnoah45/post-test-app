import { defineStore } from "pinia";

export interface Column {
  key: string;
  label: string;
  visible: boolean;
}

const STORAGE_KEY = "posts-columns-visibility";

// Load saved column visibility from localStorage
function loadColumnVisibility(): Column[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Failed to load column visibility:", e);
  }
  // Default columns if nothing saved
  return [
    { key: "id", label: "ID", visible: true },
    { key: "title", label: "Title", visible: true },
    { key: "body", label: "Body", visible: true },
  ];
}

// Save column visibility to localStorage
function saveColumnVisibility(columns: Column[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(columns));
  } catch (e) {
    console.error("Failed to save column visibility:", e);
  }
}

export const useColumnsStore = defineStore("columns", {
  state: () => ({
    columns: loadColumnVisibility(),
  }),
  getters: {
    visibleColumns: (state) => state.columns.filter((col) => col.visible),
    columnVisibilityMap: (state) => {
      const map: Record<string, boolean> = {};
      state.columns.forEach((col) => {
        map[col.key] = col.visible;
      });
      return map;
    },
  },
  actions: {
    toggleColumn(key: string) {
      const column = this.columns.find((col) => col.key === key);
      if (column) {
        column.visible = !column.visible;
        saveColumnVisibility(this.columns);
      }
    },
    setColumnVisibility(key: string, visible: boolean) {
      const column = this.columns.find((col) => col.key === key);
      if (column) {
        column.visible = visible;
        saveColumnVisibility(this.columns);
      }
    },
    showAllColumns() {
      this.columns.forEach((col) => {
        col.visible = true;
      });
      saveColumnVisibility(this.columns);
    },
    hideAllColumns() {
      this.columns.forEach((col) => {
        col.visible = false;
      });
      saveColumnVisibility(this.columns);
    },
  },
});

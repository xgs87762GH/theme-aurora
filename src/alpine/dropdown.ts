import Alpine from "alpinejs";

// Dropdown
Alpine.data("dropdown", () => ({
  show: false,
  open() {
    this.show = true;
  },
  close() {
    this.show = false;
  },
}));


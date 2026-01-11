import Alpine from "alpinejs";

// Category Pagination
Alpine.data("categoryPagination", (totalItems: number) => {
  return {
    currentPage: 1,
    itemsPerPage: 5,
    totalItems: totalItems,
    getTotalPages() {
      return Math.ceil(this.totalItems / this.itemsPerPage);
    },
    getStartIndex() {
      return (this.currentPage - 1) * this.itemsPerPage;
    },
    getEndIndex() {
      return this.getStartIndex() + this.itemsPerPage;
    },
    hasPrevious() {
      return this.currentPage > 1;
    },
    hasNext() {
      return this.currentPage < this.getTotalPages();
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.getTotalPages()) {
        this.currentPage++;
      }
    },
  };
});


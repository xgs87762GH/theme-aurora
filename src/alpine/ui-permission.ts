import Alpine from "alpinejs";

// UI Permission
Alpine.data("uiPermission", (_username: string, _permission: string) => {
  return {
    shouldDisplay: false, // This should be set based on actual permission check
  };
});


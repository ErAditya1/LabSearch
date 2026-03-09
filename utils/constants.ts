export const ALLOWED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png", "image/tiff"];
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export const QUICK_TESTS = [
  { name: "BOD", description: "Biochemical Oxygen Demand", icon: "🧪", color: "blue" },
  { name: "COD", description: "Chemical Oxygen Demand", icon: "⚗️", color: "purple" },
  { name: "pH", description: "Hydrogen Ion Concentration", icon: "🔬", color: "green" },
  { name: "TDS", description: "Total Dissolved Solids", icon: "💧", color: "cyan" },
  { name: "TSS", description: "Total Suspended Solids", icon: "🌊", color: "orange" },
  { name: "Heavy Metals", description: "Metal Ion Detection", icon: "⚡", color: "red" },
  { name: "DO", description: "Dissolved Oxygen", icon: "🫧", color: "yellow" },
  { name: "Turbidity", description: "Water Clarity Test", icon: "🔭", color: "gray" },
];

export const SUGGESTED_KEYWORDS = [
  "BOD", "COD", "pH", "Heavy Metals", "TDS", "TSS",
  "Dissolved Oxygen", "Turbidity", "Chlorine", "Nitrate",
  "Phosphate", "Ammonia", "Coliform", "Hardness",
];

export const ROLE_PERMISSIONS = {
  admin: {
    canUpload: true,
    canDelete: true,
    canManageUsers: true,
    canSettings: true,
    canViewAnalytics: true,
  },
  analyst: {
    canUpload: true,
    canDelete: false,
    canManageUsers: false,
    canSettings: false,
    canViewAnalytics: false,
  },
  viewer: {
    canUpload: false,
    canDelete: false,
    canManageUsers: false,
    canSettings: false,
    canViewAnalytics: false,
  },
} as const;

export const config = {
  clinicName: import.meta.env.VITE_CLINIC_NAME ?? "Klinik Sehat",
  clinicTagline:
    import.meta.env.VITE_CLINIC_TAGLINE ?? "Electronic Medical Record",
  primaryColor: import.meta.env.VITE_PRIMARY_COLOR ?? "#6B2D4E",
  secondaryColor: import.meta.env.VITE_SECONDARY_COLOR ?? "#2D7A4F",
  accentColor: import.meta.env.VITE_ACCENT_COLOR ?? "#8BC34A",
};
console.log("config:", config);

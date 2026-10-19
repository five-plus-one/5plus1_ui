/** Shared brand identity and independently configurable product palettes. */
export const brandColor = "#FD8B07";
export const productThemes = {
  brand: { name: "五加一", primary: brandColor, onPrimary: "#202124", soft: "#FFF2E2", ink: "#914600", darkSoft: "#422D18", darkInk: "#FFC98F" },
  kezhan: { name: "课栈笔记", primary: "#1A73E8", onPrimary: "#FFFFFF", soft: "#E8F0FE", ink: "#185ABC", darkPrimary: "#A8C7FA", darkSoft: "#263751", darkInk: "#C2D7FA", darkOnPrimary: "#142D50" },
  marker: { name: "AI 批改助手", primary: "#13795B", onPrimary: "#FFFFFF", soft: "#E6F4ED", ink: "#0C6248", darkPrimary: "#8DD8B6", darkSoft: "#193C30", darkInk: "#B1E8CE", darkOnPrimary: "#103C2B" },
  onepass: { name: "OnePass", primary: "#7252C7", onPrimary: "#FFFFFF", soft: "#F0EAFC", ink: "#5D3DA8", darkPrimary: "#CDB8FF", darkSoft: "#35294B", darkInk: "#DFD0FF", darkOnPrimary: "#342052" },
} as const;
export type ProductTheme = keyof typeof productThemes;

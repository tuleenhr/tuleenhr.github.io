import localFont from "next/font/local";

// Tiny subsets (Google Fonts "text=" subsetting) holding only the glyphs the speech-bubble
// stickers use, including Arabic's joined letter forms. Only pages that render those stickers load them.
export const arabicSticker = localFont({
  src: "../../assets/fonts/noto-sans-arabic-600-marhaba.woff2",
  weight: "600",
  display: "block",
  fallback: ["Geeza Pro", "Noto Sans Arabic", "sans-serif"],
});

export const chineseSticker = localFont({
  src: "../../assets/fonts/noto-sans-sc-600-nihao.woff2",
  weight: "600",
  display: "block",
  fallback: ["PingFang SC", "Noto Sans SC", "sans-serif"],
});

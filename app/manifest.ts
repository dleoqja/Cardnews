import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "오늘의 카드 · 카드뉴스",
    short_name: "오늘의 카드",
    description:
      "릴스처럼 넘겨 보는 카드뉴스 앱. 세로 스와이프로 핵심 뉴스를 빠르게.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0A0A0B",
    theme_color: "#0A0A0B",
    lang: "ko",
    dir: "ltr",
    categories: ["news", "magazines"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "좋아요한 기사",
        short_name: "좋아요",
        url: "/liked",
      },
    ],
  };
}

export const metadata = {
  title: "오프라인",
};

export default function OfflinePage() {
  return (
    <main className="grid min-h-[100svh] place-items-center bg-ink px-8 text-center">
      <div>
        <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-3xl bg-accent/15 text-3xl">
          📡
        </div>
        <h1 className="text-2xl font-extrabold text-white">
          오프라인 상태예요
        </h1>
        <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-white/55">
          인터넷 연결이 끊겼어요. 좋아요한 기사는 연결 없이도 볼 수 있어요.
          연결이 돌아오면 새 소식이 다시 채워집니다.
        </p>
        <a
          href="/liked"
          className="mt-6 inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-bold text-ink active:scale-95"
        >
          좋아요한 기사 보기
        </a>
      </div>
    </main>
  );
}

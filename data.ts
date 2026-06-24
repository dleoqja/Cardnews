import type { NewsArticle, NewsCategory } from "./types";

/**
 * Sample news data.
 *
 * Replace this array with your own source (a CMS, an API route, or a JSON
 * file) — the shape is all the app depends on. Images use picsum.photos
 * placeholders with stable seeds so they load consistently; swap the `image`
 * URLs for real article images in production.
 */
export const NEWS: NewsArticle[] = [
  {
    id: 1,
    title: "초거대 AI, 이제 스마트폰에서 직접 돈다",
    summary:
      "클라우드 없이 기기 안에서 추론하는 온디바이스 모델이 보급되며 응답 속도와 개인정보 보호가 동시에 개선되고 있다.",
    image: "https://picsum.photos/seed/ai-ondevice/900/1100",
    content:
      "스마트폰 제조사들이 잇따라 온디바이스 인공지능을 전면에 내세우고 있다. 그동안 대형 언어모델은 막대한 연산량 탓에 대부분 클라우드 서버에서 처리됐지만, 모델 경량화 기술과 전용 신경망 칩의 발전으로 이제는 손안의 기기에서도 실시간 추론이 가능해졌다.\n\n온디바이스 방식의 가장 큰 장점은 응답 속도다. 네트워크를 거치지 않기 때문에 입력과 거의 동시에 결과가 나온다. 통신이 불안정한 환경에서도 끊김 없이 작동한다.\n\n개인정보 보호 측면의 의미도 크다. 사용자의 대화나 사진이 외부 서버로 전송되지 않고 기기 안에서만 처리되므로 데이터 유출 위험이 근본적으로 줄어든다.\n\n업계는 향후 1~2년 안에 중급형 기기에도 이러한 기능이 기본 탑재될 것으로 전망한다. 다만 배터리 소모와 발열을 어떻게 잡을지가 대중화의 관건으로 꼽힌다.",
    source: "테크인사이트",
    sourceUrl: "https://example.com/news/ai-on-device",
    publishedAt: "2026-06-23T08:30:00.000Z",
    category: "기술",
    likeCount: 1284,
  },
  {
    id: 2,
    title: "한국은행 기준금리 동결… 시장은 인하 시점에 주목",
    summary:
      "물가 둔화 흐름 속에서 금리를 묶었지만, 시장은 하반기 첫 인하 가능성에 무게를 두며 채권 금리가 하락했다.",
    image: "https://picsum.photos/seed/economy-rate/900/1100",
    content:
      "한국은행 금융통화위원회가 기준금리를 현 수준에서 동결했다. 물가 상승률이 목표치에 근접했지만, 환율과 가계부채 등 대외·대내 불확실성을 함께 고려한 결정으로 풀이된다.\n\n시장의 관심은 이미 다음 단계로 옮겨갔다. 채권시장에서는 하반기 첫 금리 인하 기대가 반영되며 국고채 금리가 소폭 하락했다.\n\n전문가들은 인하 시점을 두고 의견이 엇갈린다. 일부는 물가 안정세를 근거로 이르면 다음 분기를 점치지만, 환율 변동성을 이유로 신중론을 펴는 목소리도 적지 않다.\n\n한국은행 총재는 회견에서 데이터에 기반해 유연하게 대응하겠다는 기존 입장을 재확인했다.",
    source: "경제리포트",
    sourceUrl: "https://example.com/news/base-rate-freeze",
    publishedAt: "2026-06-24T01:10:00.000Z",
    category: "경제",
    likeCount: 642,
  },
  {
    id: 3,
    title: "도심 상공 누비는 '에어택시', 연내 시범 운행",
    summary:
      "수직 이착륙 비행체가 도심 교통 체증의 대안으로 떠오르며, 주요 도시가 전용 이착륙장 구축에 나섰다.",
    image: "https://picsum.photos/seed/air-taxi/900/1100",
    content:
      "전기로 움직이는 수직 이착륙 비행체, 이른바 에어택시가 상용화 문턱에 다가섰다. 국토 당국은 안전 인증 절차를 마친 기체를 대상으로 연내 도심 시범 운행을 추진한다고 밝혔다.\n\n에어택시는 활주로 없이 헬리콥터처럼 뜨고 내리지만, 다수의 프로펠러로 소음과 진동을 크게 줄인 것이 특징이다. 배터리로 구동돼 탄소 배출도 적다.\n\n초기에는 공항과 도심을 잇는 노선에 집중될 전망이다. 자동차로 한 시간 넘게 걸리던 구간을 십여 분으로 단축할 수 있다는 기대가 나온다.\n\n관건은 비용과 신뢰다. 대중교통 수준의 요금을 실현하고, 악천후 운항 안전을 확보하는 일이 남은 과제로 지목된다.",
    source: "모빌리티투데이",
    sourceUrl: "https://example.com/news/air-taxi-pilot",
    publishedAt: "2026-06-22T22:05:00.000Z",
    category: "과학",
    likeCount: 988,
  },
  {
    id: 4,
    title: "여름 폭염 앞두고 전력 수요 역대 최고치 경신 전망",
    summary:
      "이른 더위로 냉방 수요가 급증하며, 전력 당국이 안정적 공급을 위한 비상 대응 체계를 가동했다.",
    image: "https://picsum.photos/seed/heatwave-power/900/1100",
    content:
      "올여름 전력 수요가 역대 최고 수준에 이를 것으로 전망된다. 예년보다 이른 폭염이 찾아오면서 냉방 사용이 빠르게 늘고 있기 때문이다.\n\n전력 당국은 여름철 전력 수급 대책 기간을 앞당겨 운영에 들어갔다. 발전 설비를 최대로 가동하고, 수요가 몰리는 시간대에는 절전을 유도하는 방안을 병행한다.\n\n전문가들은 재생에너지 발전 비중이 늘면서 시간대별 변동성이 커진 점을 주의 깊게 봐야 한다고 조언한다. 일조량과 풍속에 따라 공급이 출렁일 수 있기 때문이다.\n\n가정에서는 적정 실내온도를 유지하고 사용하지 않는 기기의 전원을 끄는 등의 작은 실천이 권장된다.",
    source: "데일리환경",
    sourceUrl: "https://example.com/news/summer-power-demand",
    publishedAt: "2026-06-24T03:40:00.000Z",
    category: "속보",
    likeCount: 311,
  },
  {
    id: 5,
    title: "K-인디 게임, 글로벌 플랫폼 동시 1위 올랐다",
    summary:
      "소규모 국내 스튜디오가 만든 신작이 출시 직후 여러 국가 차트 정상에 오르며 흥행 돌풍을 일으켰다.",
    image: "https://picsum.photos/seed/indie-game/900/1100",
    content:
      "국내 인디 게임이 세계 시장에서 돌풍을 일으키고 있다. 다섯 명 남짓한 소규모 팀이 수년간 개발한 신작이 출시 직후 여러 나라의 다운로드 차트에서 1위에 올랐다.\n\n이 게임은 한국적 정서를 담은 독특한 미술 양식과 탄탄한 서사로 입소문을 탔다. 화려한 자본 대신 완성도와 개성으로 승부했다는 평가다.\n\n해외 이용자들은 번역 품질과 세심한 현지화에도 호평을 보내고 있다. 개발사는 이용자 피드백을 반영한 업데이트를 빠르게 내놓으며 호응을 이어가고 있다.\n\n업계는 대형 스튜디오가 주도하던 시장에서 작은 팀도 충분히 성공할 수 있음을 보여준 사례라고 평가했다.",
    source: "게임캐스트",
    sourceUrl: "https://example.com/news/k-indie-game",
    publishedAt: "2026-06-21T12:00:00.000Z",
    category: "문화",
    likeCount: 2057,
  },
  {
    id: 6,
    title: "프로야구 후반기 개막, 순위 경쟁 더 뜨거워진다",
    summary:
      "상위권 팀 간 승차가 좁혀지며, 가을 야구 진출을 향한 치열한 순위 다툼이 예고됐다.",
    image: "https://picsum.photos/seed/baseball-season/900/1100",
    content:
      "프로야구가 후반기 일정에 돌입했다. 전반기를 마친 시점에서 상위권 팀들의 승차가 크지 않아 어느 때보다 치열한 순위 경쟁이 예상된다.\n\n선두권 팀들은 마운드 안정과 타선의 응집력을 바탕으로 선두 자리를 지키려 한다. 반면 중위권 팀들은 외국인 선수 교체와 전력 보강으로 반등을 노린다.\n\n부상 변수도 변수다. 주축 선수들의 컨디션 관리가 가을 야구 진출의 분수령이 될 전망이다.\n\n팬들의 관심도 뜨겁다. 주요 경기 입장권이 잇따라 매진되며 흥행 열기가 후반기까지 이어지고 있다.",
    source: "스포츠라인",
    sourceUrl: "https://example.com/news/kbo-second-half",
    publishedAt: "2026-06-20T09:15:00.000Z",
    category: "스포츠",
    likeCount: 745,
  },
  {
    id: 7,
    title: "바다에서 태양광·풍력 동시에… 해상 복합발전 첫 가동",
    summary:
      "한정된 해역을 효율적으로 쓰는 복합발전 단지가 가동을 시작하며 재생에너지 확대에 속도가 붙었다.",
    image: "https://picsum.photos/seed/offshore-energy/900/1100",
    content:
      "바다 위에서 태양광과 풍력을 함께 생산하는 복합발전 단지가 처음으로 가동에 들어갔다. 같은 해역에서 두 가지 방식을 결합해 부지 활용도를 크게 높인 것이 핵심이다.\n\n낮에는 태양광이, 바람이 강한 시간대에는 풍력이 발전을 맡아 서로의 빈틈을 보완한다. 이를 통해 시간대별 공급 변동을 줄일 수 있다는 설명이다.\n\n해양 생태계에 미치는 영향을 줄이기 위한 설계도 적용됐다. 구조물 간격을 넓혀 조류 흐름과 어류 이동을 방해하지 않도록 했다.\n\n운영사는 이번 단지의 성과를 토대로 인근 해역으로 사업을 확대할 계획이라고 밝혔다.",
    source: "에너지뉴스",
    sourceUrl: "https://example.com/news/offshore-hybrid-power",
    publishedAt: "2026-06-19T15:25:00.000Z",
    category: "과학",
    likeCount: 533,
  },
  {
    id: 8,
    title: "전국 미술관 무료 개방 주간, 관람객 발길 이어져",
    summary:
      "문턱을 낮춘 문화 행사로 평소 미술관을 찾지 않던 시민까지 모이며 지역 상권에도 활기가 돌았다.",
    image: "https://picsum.photos/seed/museum-week/900/1100",
    content:
      "전국 주요 미술관이 한 주 동안 입장료를 받지 않는 무료 개방 행사를 열었다. 문화 향유의 문턱을 낮추자는 취지로 마련된 이번 행사에는 가족 단위 관람객이 대거 몰렸다.\n\n평소 미술관을 찾지 않던 시민들도 이번 기회에 전시장을 둘러봤다. 어린이를 위한 체험 프로그램과 도슨트 해설이 함께 운영돼 호응을 얻었다.\n\n미술관 주변 카페와 식당 등 지역 상권에도 온기가 돌았다. 관람을 마친 방문객들이 자연스럽게 인근 가게로 향했기 때문이다.\n\n주최 측은 시민 반응이 좋은 만큼 정기 행사로 확대하는 방안을 검토하겠다고 밝혔다.",
    source: "컬처위크",
    sourceUrl: "https://example.com/news/free-museum-week",
    publishedAt: "2026-06-18T10:50:00.000Z",
    category: "문화",
    likeCount: 421,
  },
  {
    id: 9,
    title: "물가 잡힌 장바구니… 신선식품 가격 안정세",
    summary:
      "기상 여건이 호전되며 채소·과일 출하량이 늘어 주요 신선식품 가격이 지난달보다 내렸다.",
    image: "https://picsum.photos/seed/grocery-price/900/1100",
    content:
      "장바구니 물가가 한숨 돌렸다. 기상 여건이 좋아지면서 채소와 과일 출하량이 늘어 주요 신선식품 가격이 지난달보다 떨어졌다.\n\n특히 잎채소류의 내림폭이 컸다. 폭우와 폭염으로 한때 급등했던 가격이 공급 회복과 함께 빠르게 안정됐다.\n\n다만 가공식품과 외식 물가는 여전히 높은 수준을 유지하고 있다. 원재료비와 인건비 부담이 반영된 결과로 분석된다.\n\n유통업계는 여름 휴가철 수요 증가에 대비해 물량 확보에 나서고 있다. 당분간 신선식품 가격은 안정세를 이어갈 것으로 보인다.",
    source: "경제리포트",
    sourceUrl: "https://example.com/news/fresh-food-price",
    publishedAt: "2026-06-17T07:00:00.000Z",
    category: "경제",
    likeCount: 276,
  },
  {
    id: 10,
    title: "차세대 배터리, 충전 10분에 500km 주행 시대 눈앞",
    summary:
      "급속 충전 성능을 끌어올린 신형 배터리 양산 계획이 공개되며 전기차 충전 불편이 크게 줄어들 전망이다.",
    image: "https://picsum.photos/seed/ev-battery/900/1100",
    content:
      "전기차의 가장 큰 불편으로 꼽히던 충전 시간이 획기적으로 줄어들 전망이다. 한 배터리 제조사가 10분 남짓한 급속 충전으로 수백 킬로미터를 달릴 수 있는 신형 배터리의 양산 계획을 공개했다.\n\n핵심은 전극 소재와 구조의 개선이다. 충전 시 발생하는 열을 효과적으로 분산해 빠른 충전에도 안정성을 유지하도록 설계됐다.\n\n주행 거리뿐 아니라 수명도 늘었다. 반복 충전에 따른 성능 저하를 줄여 장기간 사용해도 용량 손실이 적다는 설명이다.\n\n업계는 충전 인프라 확충과 맞물릴 경우 전기차 대중화가 한층 빨라질 것으로 내다봤다.",
    source: "테크인사이트",
    sourceUrl: "https://example.com/news/next-gen-battery",
    publishedAt: "2026-06-16T13:35:00.000Z",
    category: "기술",
    likeCount: 1622,
  },
  {
    id: 11,
    title: "재택근무 끝? 주요 기업 '사무실 복귀' 다시 늘어",
    summary:
      "협업과 조직문화를 이유로 출근을 늘리는 기업이 증가하면서, 일하는 방식을 둘러싼 논쟁이 재점화됐다.",
    image: "https://picsum.photos/seed/return-office/900/1100",
    content:
      "팬데믹 이후 자리잡은 재택근무 문화에 변화의 바람이 불고 있다. 일부 대기업을 중심으로 주 단위 출근일을 늘리는 정책이 잇따라 도입되고 있다.\n\n기업들은 대면 협업의 효율과 조직문화 유지를 이유로 든다. 화면 너머로는 메우기 어려운 우연한 소통과 신입 직원의 적응을 강조한다.\n\n반면 직원들의 반응은 엇갈린다. 통근 시간과 비용 부담을 호소하며 유연근무를 선호하는 목소리도 여전히 크다.\n\n전문가들은 일률적 정책보다 직무 특성에 맞춘 유연한 설계가 필요하다고 조언한다. 출근과 재택의 균형점을 찾는 실험이 당분간 이어질 전망이다.",
    source: "워크플레이스",
    sourceUrl: "https://example.com/news/return-to-office",
    publishedAt: "2026-06-15T08:20:00.000Z",
    category: "경제",
    likeCount: 489,
  },
  {
    id: 12,
    title: "우주 망원경, 가장 먼 은하 빛 포착… 우주 초기 단서",
    summary:
      "관측 사상 가장 먼 거리의 은하에서 온 빛을 분석해, 초기 우주의 별 형성 과정을 새롭게 규명했다.",
    image: "https://picsum.photos/seed/space-telescope/900/1100",
    content:
      "우주 망원경이 관측 사상 가장 먼 거리에 있는 은하의 빛을 포착했다. 이 빛은 우주가 탄생하고 얼마 지나지 않은 초기에 출발해 오랜 시간 우주를 가로질러 도달한 것이다.\n\n연구진은 빛의 스펙트럼을 분석해 당시 은하의 구성 성분과 별 형성 속도를 추정했다. 예상보다 빠르게 별이 만들어졌다는 점이 확인돼 학계의 주목을 받고 있다.\n\n이는 초기 우주가 어떻게 지금의 모습으로 진화했는지를 이해하는 중요한 단서가 된다. 기존 이론을 보완하거나 수정해야 할 가능성도 제기된다.\n\n연구진은 추가 관측을 통해 더 먼 은하를 찾는 작업을 이어갈 계획이다.",
    source: "사이언스나우",
    sourceUrl: "https://example.com/news/deep-space-galaxy",
    publishedAt: "2026-06-14T11:05:00.000Z",
    category: "과학",
    likeCount: 1190,
  },
];

const PAGE_SIZE = 6;

/**
 * Simulated paginated fetch. In a real app this would hit an API route.
 * To demonstrate infinite scroll with a finite dataset, we loop the data
 * and assign fresh ids on subsequent "pages".
 */
export async function fetchNewsPage(
  page: number,
  category: NewsCategory = "전체",
): Promise<{ items: NewsArticle[]; hasMore: boolean }> {
  // Simulate network latency so skeletons are visible.
  await new Promise((r) => setTimeout(r, page === 0 ? 350 : 600));

  const pool =
    category === "전체" ? NEWS : NEWS.filter((n) => n.category === category);

  if (pool.length === 0) return { items: [], hasMore: false };

  const start = page * PAGE_SIZE;
  const items: NewsArticle[] = [];
  for (let i = 0; i < PAGE_SIZE; i++) {
    const base = pool[(start + i) % pool.length];
    const loop = Math.floor((start + i) / pool.length);
    items.push(
      loop === 0
        ? base
        : { ...base, id: base.id + loop * 1000 }, // stable, unique ids per loop
    );
  }

  // Provide a generous but finite feed (loop the pool up to 5 times).
  const hasMore = start + PAGE_SIZE < pool.length * 5;
  return { items, hasMore };
}

export function getArticleById(id: number): NewsArticle | undefined {
  const base = NEWS.find((n) => n.id === id % 1000 || n.id === id);
  if (!base) return undefined;
  if (id >= 1000) return { ...base, id };
  return base;
}

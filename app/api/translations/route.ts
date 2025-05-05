import { NextResponse } from "next/server"

const translations = {
  en: {
    header: {
      title: "Quran.co",
      search: "What do you want to read?",
      user: "User profile",
      settings: "Settings",
    },
    quickLinks: {
      about: "About The Quran",
      alMulk: "Al Mulk",
      yaseen: "Yaseen",
      alKahf: "Al Kahf",
      alWaqiah: "Al Waqi'ah",
    },
    growthJourney: {
      title: "Quran Growth Journey",
      readingGoals: "Custom Quran Reading Goals",
      createGoal: "Create Goal",
      learningPlans: "Learning Plans",
      seeAllPlans: "See All Plans",
    },
    surahList: {
      recentlyRead: "Recently Read",
      bookmarks: "Bookmarks",
      search: "Search surah...",
      ayahs: "Ayahs",
      previous: "Previous",
      next: "Next",
      page: "Page {current} of {total}",
    },
  },
  ar: {
    header: {
      title: "القرآن",
      search: "ماذا تريد أن تقرأ؟",
      user: "الملف الشخصي",
      settings: "الإعدادات",
    },
    quickLinks: {
      about: "عن القرآن",
      alMulk: "الملك",
      yaseen: "يس",
      alKahf: "الكهف",
      alWaqiah: "الواقعة",
    },
    growthJourney: {
      title: "رحلة النمو القرآني",
      readingGoals: "أهداف القراءة المخصصة",
      createGoal: "إنشاء هدف",
      learningPlans: "خطط التعلم",
      seeAllPlans: "عرض جميع الخطط",
    },
    surahList: {
      recentlyRead: "قرئت مؤخراً",
      bookmarks: "المرجعية",
      search: "البحث عن سورة...",
      ayahs: "آيات",
      previous: "السابق",
      next: "التالي",
      page: "الصفحة {current} من {total}",
    },
  },
  id: {
    header: {
      title: "Quran.co",
      search: "Apa yang ingin Anda baca?",
      user: "Profil pengguna",
      settings: "Pengaturan",
    },
    quickLinks: {
      about: "Tentang Al-Quran",
      alMulk: "Al-Mulk",
      yaseen: "Yasin",
      alKahf: "Al-Kahf",
      alWaqiah: "Al-Waqi'ah",
    },
    growthJourney: {
      title: "Perjalanan Pertumbuhan Al-Quran",
      readingGoals: "Target Membaca Al-Quran",
      createGoal: "Buat Target",
      learningPlans: "Rencana Pembelajaran",
      seeAllPlans: "Lihat Semua Rencana",
    },
    surahList: {
      recentlyRead: "Baru Dibaca",
      bookmarks: "Penanda",
      search: "Cari surah...",
      ayahs: "Ayat",
      previous: "Sebelumnya",
      next: "Selanjutnya",
      page: "Halaman {current} dari {total}",
    },
  },
  ja: {
    header: {
      title: "クルアーン",
      search: "何を読みたいですか？",
      user: "ユーザープロフィール",
      settings: "設定",
    },
    quickLinks: {
      about: "クルアーンについて",
      alMulk: "アル・ムルク章",
      yaseen: "ヤー・スィーン章",
      alKahf: "洞窟章",
      alWaqiah: "出来事章",
    },
    growthJourney: {
      title: "クルアーン学習の旅",
      readingGoals: "カスタム読書目標",
      createGoal: "目標を作成",
      learningPlans: "学習プラン",
      seeAllPlans: "すべてのプランを見る",
    },
    surahList: {
      recentlyRead: "最近読んだ",
      bookmarks: "ブックマーク",
      search: "スーラを検索...",
      ayahs: "節",
      previous: "前へ",
      next: "次へ",
      page: "{total}ページ中{current}ページ目",
    },
  },
  zh: {
    header: {
      title: "古兰经",
      search: "你想读什么？",
      user: "用户资料",
      settings: "设置",
    },
    quickLinks: {
      about: "关于古兰经",
      alMulk: "国权章",
      yaseen: "雅辛章",
      alKahf: "山洞章",
      alWaqiah: "大事章",
    },
    growthJourney: {
      title: "古兰经学习之旅",
      readingGoals: "自定义阅读目标",
      createGoal: "创建目标",
      learningPlans: "学习计划",
      seeAllPlans: "查看所有计划",
    },
    surahList: {
      recentlyRead: "最近阅读",
      bookmarks: "书签",
      search: "搜索章节...",
      ayahs: "节",
      previous: "上一页",
      next: "下一页",
      page: "第 {current} 页，共 {total} 页",
    },
  },
  ko: {
    header: {
      title: "꾸란",
      search: "무엇을 읽고 싶으신가요?",
      user: "사용자 프로필",
      settings: "설정",
    },
    quickLinks: {
      about: "꾸란에 대하여",
      alMulk: "알-물크 장",
      yaseen: "야신 장",
      alKahf: "동굴 장",
      alWaqiah: "사건 장",
    },
    growthJourney: {
      title: "꾸란 학습 여정",
      readingGoals: "맞춤 독서 목표",
      createGoal: "목표 만들기",
      learningPlans: "학습 계획",
      seeAllPlans: "모든 계획 보기",
    },
    surahList: {
      recentlyRead: "최근에 읽은",
      bookmarks: "북마크",
      search: "수라 검색...",
      ayahs: "절",
      previous: "이전",
      next: "다음",
      page: "총 {total}페이지 중 {current}페이지",
    },
  },
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lang = searchParams.get("lang") || "en"

  if (!translations[lang as keyof typeof translations]) {
    return NextResponse.json({ error: "Language not found" }, { status: 404 })
  }

  return NextResponse.json(translations[lang as keyof typeof translations])
}

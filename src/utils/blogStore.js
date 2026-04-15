import featureImage from "../pages/home/photo_2026-04-03_13-37-22.jpg";
import profileImage from "../pages/home/img/rasimim.jpg";

export const BLOG_STORAGE_KEY = "ozodcode-blog-posts";
export const DASHBOARD_AUTH_KEY = "ozodcode-dashboard-auth";

export const ADMIN_EMAIL = "mamatovo354@gmail.com";
export const ADMIN_PASSWORD = "123@Ozod";

const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "long" });
const fullDateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

const defaultPosts = [
  {
    id: "default-1",
    slug: "frontendga-kirish-va-birinchi-portfolio",
    title: "Frontendga kirish va birinchi portfolio",
    summary:
      "Birinchi marta portfolio ustida ishlaganimda dizayn, struktura va foydalanuvchi tajribasi qanday birlashishini tushunib bordim.",
    highlight:
      "Yaxshi portfolio faqat chiroyli ko'rinish emas, balki odamga siz kim ekaningizni 10 soniyada tushuntirib beradigan sahifa hamdir.",
    content:
      "Frontendni chuqurroq o'rganishni boshlaganimda eng birinchi katta vazifa portfolio yig'ish bo'ldi.\n\nHar bir section ustida ishlaganim sari matn, spacing va ranglar qanchalik muhim ekanini ko'rdim. Ayniqsa oddiy sahifani ham toza va ishonchli ko'rsatish uchun detallar katta rol o'ynadi.\n\nShu jarayon menga bir narsani o'rgatdi: foydalanuvchi avval hissiyot bilan baho beradi, keyin kontentni o'qiydi.",
    image: featureImage,
    externalLink: "https://t.me/OzodCode",
    date: "2026-04-15",
  },
  {
    id: "default-2",
    slug: "reactda-komponent-bilan-fikrlash",
    title: "Reactda komponent bilan fikrlash",
    summary:
      "Bir sahifani bo'laklarga ajratib qurish nafaqat kodni tozalaydi, balki keyingi o'zgarishlarni ham ancha osonlashtiradi.",
    highlight:
      "Komponentlar ko'paygani yomon emas, tartibsiz komponentlar ko'paygani yomon.",
    content:
      "React bilan ishlaganda har bir blokni alohida komponent sifatida ko'rish odatga aylanishi kerak.\n\nNavbar, hero, blog list, footer - bular alohida bo'lsa, sahifani kengaytirish ancha soddalashadi. Bugun kerak bo'lmagan ajratish ertaga vaqtni tejaydi.\n\nAgar komponent o'z vazifasini aniq bajarsa, styling va logikani boshqarish ham yengillashadi.",
    image: profileImage,
    externalLink: "",
    date: "2026-04-10",
  },
  {
    id: "default-3",
    slug: "amaliyot-bilan-osadigan-dasturchi",
    title: "Amaliyot bilan o'sadigan dasturchi",
    summary:
      "Dars ko'rish foydali, lekin haqiqiy o'sish amaliy loyiha ustida qo'l tekkizilganda boshlanadi.",
    highlight:
      "Har bir tugallangan kichik loyiha keyingi katta loyihaning tayyorgarligi bo'ladi.",
    content:
      "Ko'p odamlar qayerdan boshlashni o'ylab uzoq turib qoladi. Menimcha eng yaxshi yo'l - kichik bo'lsa ham biror narsa qurib ko'rish.\n\nShunda xatolar tezroq ko'rinadi, savollar tabiiy tug'iladi va o'rganish ham ancha mazmunli bo'ladi. Aynan shu sababli blog, dashboard va portfolio kabi amaliy ishlarga ko'proq vaqt berish foydali.\n\nKod yozish davomida yig'ilgan tajriba video yoki maqoladan olingan bilimni mustahkamlaydi.",
    image: featureImage,
    externalLink: "",
    date: "2026-03-28",
  },
];

const escapeHtml = (value = "") =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const paragraphsToHtml = (value = "") =>
  value
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");

const buildLegacyHtml = (post) => {
  const parts = [];

  if (post.image) {
    parts.push(
      `<figure class="editor-image-block" data-image-block="true"><img src="${post.image}" alt="${escapeHtml(
        post.title
      )}" /></figure>`
    );
  }

  if (post.highlight) {
    parts.push(`<p><strong>${escapeHtml(post.highlight)}</strong></p>`);
  }

  parts.push(paragraphsToHtml(post.content || ""));

  if (post.externalLink) {
    parts.push(
      `<p><a href="${escapeHtml(
        post.externalLink
      )}" target="_blank" rel="noreferrer">Qo'shilgan havolani ochish</a></p>`
    );
  }

  return parts.join("");
};

const normalizePost = (post) => ({
  ...post,
  contentHtml: post.contentHtml || buildLegacyHtml(post),
});

const cloneDefaultPosts = () => defaultPosts.map((post) => normalizePost({ ...post }));

export const createSlug = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export const sortPosts = (posts) =>
  [...posts].sort((left, right) => {
    const rightTime = new Date(right.date).getTime();
    const leftTime = new Date(left.date).getTime();
    return rightTime - leftTime;
  });

export const getStoredPosts = () => {
  if (typeof window === "undefined") {
    return cloneDefaultPosts();
  }

  const savedPosts = window.localStorage.getItem(BLOG_STORAGE_KEY);

  if (!savedPosts) {
    const seededPosts = cloneDefaultPosts();
    window.localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(seededPosts));
    return sortPosts(seededPosts);
  }

  try {
    return sortPosts(JSON.parse(savedPosts).map(normalizePost));
  } catch (error) {
    const fallbackPosts = cloneDefaultPosts();
    window.localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(fallbackPosts));
    return sortPosts(fallbackPosts);
  }
};

export const savePosts = (posts) => {
  if (typeof window === "undefined") {
    return;
  }

  const normalizedPosts = sortPosts(posts).map(normalizePost);
  window.localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(normalizedPosts));
};

export const isAuthenticated = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(DASHBOARD_AUTH_KEY) === "true";
};

export const setAuthenticated = (value) => {
  if (typeof window === "undefined") {
    return;
  }

  if (value) {
    window.localStorage.setItem(DASHBOARD_AUTH_KEY, "true");
    return;
  }

  window.localStorage.removeItem(DASHBOARD_AUTH_KEY);
};

export const formatDisplayDate = (dateString) =>
  fullDateFormatter.format(new Date(dateString));

export const getMonthName = (dateString) =>
  monthFormatter.format(new Date(dateString));

export const groupPostsByYear = (posts) => {
  const grouped = new Map();

  sortPosts(posts).forEach((post) => {
    const year = String(new Date(post.date).getFullYear());
    const month = getMonthName(post.date);

    if (!grouped.has(year)) {
      grouped.set(year, new Map());
    }

    const yearBucket = grouped.get(year);

    if (!yearBucket.has(month)) {
      yearBucket.set(month, []);
    }

    yearBucket.get(month).push(post);
  });

  return grouped;
};

export const buildUniqueSlug = (source, posts, currentId = null) => {
  const baseSlug = createSlug(source) || "yangi-blog";
  let nextSlug = baseSlug;
  let counter = 1;

  while (posts.some((post) => post.slug === nextSlug && post.id !== currentId)) {
    nextSlug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return nextSlug;
};

export const stripHtml = (value = "") =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

import featureImage from "../pages/home/photo_2026-04-03_13-37-22.jpg";
import profileImage from "../pages/home/img/rasimim.jpg";

export const BLOG_STORAGE_KEY = "ozodcode-blog-posts";
export const DASHBOARD_AUTH_KEY = "ozodcode-dashboard-auth";
export const BLOG_API_ENDPOINT = "/api/posts";

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
    
  }
   
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
      `<p><strong>Havola:</strong> ${escapeHtml(post.externalLink)}</p>`
    );
  }

  return parts.join("");
};

const normalizePost = (post) => ({
  ...post,
  summary: post.summary || "",
  contentHtml: post.contentHtml || buildLegacyHtml(post),
});

export const cloneDefaultPosts = () =>
  defaultPosts.map((post) => normalizePost({ ...post }));

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

export const fetchPosts = async () => {
  if (typeof window === "undefined") {
    return cloneDefaultPosts();
  }

  try {
    const response = await fetch(BLOG_API_ENDPOINT, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`API ${response.status}`);
    }

    const data = await response.json();
    const remotePosts = Array.isArray(data?.posts) ? data.posts : [];

    if (!remotePosts.length) {
      return getStoredPosts();
    }

    const normalizedPosts = sortPosts(remotePosts.map(normalizePost));
    window.localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(normalizedPosts));
    return normalizedPosts;
  } catch (error) {
    return getStoredPosts();
  }
};

export const syncPosts = async (posts) => {
  const normalizedPosts = sortPosts(posts).map(normalizePost);
  savePosts(normalizedPosts);

  if (typeof window === "undefined") {
    return normalizedPosts;
  }

  try {
    const response = await fetch(BLOG_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ posts: normalizedPosts }),
    });

    if (!response.ok) {
      throw new Error(`API ${response.status}`);
    }

    const data = await response.json();
    const syncedPosts = Array.isArray(data?.posts) ? data.posts.map(normalizePost) : normalizedPosts;
    savePosts(syncedPosts);
    return sortPosts(syncedPosts);
  } catch (error) {
    return normalizedPosts;
  }
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

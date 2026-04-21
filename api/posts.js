const KV_KEY = "portfolio-blog-posts";

const json = (response, statusCode, payload) => {
  response.status(statusCode).setHeader("Content-Type", "application/json");
  response.send(JSON.stringify(payload));
};

const getKvConfig = () => {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  const readOnlyToken =
    process.env.KV_REST_API_READ_ONLY_TOKEN || process.env.UPSTASH_REDIS_REST_READ_ONLY_TOKEN;

  if (!url || !token) {
    return null;
  }

  return {
    readOnlyToken,
    url,
    token,
  };
};

const readPosts = async (config) => {
  const response = await fetch(`${config.url}/get/${KV_KEY}`, {
    headers: {
      Authorization: `Bearer ${config.readOnlyToken || config.token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`KV GET ${response.status}`);
  }

  const data = await response.json();

  if (typeof data?.result !== "string") {
    return [];
  }

  try {
    return JSON.parse(data.result);
  } catch (error) {
    return [];
  }
};

const writePosts = async (config, posts) => {
  const response = await fetch(`${config.url}/set/${KV_KEY}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "text/plain",
    },
    body: JSON.stringify(posts),
  });

  if (!response.ok) {
    throw new Error(`KV SET ${response.status}`);
  }
};

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");

  if (request.method === "OPTIONS") {
    response.status(204).end();
    return;
  }

  const config = getKvConfig();

  if (!config) {
    json(response, 503, {
      posts: [],
      message: "KV storage sozlanmagan.",
    });
    return;
  }

  try {
    if (request.method === "GET") {
      const posts = await readPosts(config);
      json(response, 200, { posts });
      return;
    }

    if (request.method === "POST") {
      const posts = Array.isArray(request.body?.posts) ? request.body.posts : null;

      if (!posts) {
        json(response, 400, {
          message: "posts array yuborilishi kerak.",
        });
        return;
      }

      await writePosts(config, posts);
      json(response, 200, { posts });
      return;
    }

    json(response, 405, {
      message: "Faqat GET va POST qo'llab-quvvatlanadi.",
    });
  } catch (error) {
    json(response, 500, {
      posts: [],
      message: "Postlarni saqlashda xatolik yuz berdi.",
    });
  }
}

interface Env {
  GHGACHA_CACHE: KVNamespace;
}

const RARITY_RANGES: Record<string, { starsMin: number; starsMax: number }> = {
  N: { starsMin: 0, starsMax: 100 },
  R: { starsMin: 100, starsMax: 1000 },
  SR: { starsMin: 1000, starsMax: 10000 },
  UR: { starsMin: 10000, starsMax: Infinity },
};

function buildQuery(language: string, starsMin: number, starsMax: number): string {
  if (!Number.isFinite(starsMax)) {
    return `language:${language} stars:>=${starsMin} sort:stars`;
  }
  return `language:${language} stars:${starsMin}..${starsMax} sort:stars`;
}

async function fetchFromGitHub(query: string): Promise<any[]> {
  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&per_page=100&order=desc`;
  const response = await fetch(url, {
    headers: { Accept: "application/vnd.github.v3+json", "User-Agent": "GHGacha/1.0" },
  });
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }
  const data: any = await response.json();
  return data.items || [];
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const language = url.searchParams.get("language");
  const rarity = url.searchParams.get("rarity");

  if (!language || !rarity || !(rarity in RARITY_RANGES)) {
    return new Response(JSON.stringify({ error: "Missing or invalid language/rarity parameters" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const range = RARITY_RANGES[rarity];
  const cacheKey = `search:${language.toLowerCase()}:${range.starsMin}..${range.starsMax === Infinity ? "999999999" : range.starsMax}`;

  const cached = await context.env.GHGACHA_CACHE.get(cacheKey);
  if (cached) {
    const items = JSON.parse(cached);
    const repo = items[Math.floor(Math.random() * items.length)];
    return new Response(JSON.stringify({ repo, rarity }), {
      headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=3600" },
    });
  }

  const query = buildQuery(language, range.starsMin, range.starsMax);
  const items = await fetchFromGitHub(query);

  if (items.length === 0) {
    return new Response(JSON.stringify({ error: "No repositories found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  await context.env.GHGACHA_CACHE.put(cacheKey, JSON.stringify(items), { expirationTtl: 3600 });

  const repo = items[Math.floor(Math.random() * items.length)];
  return new Response(JSON.stringify({ repo, rarity }), {
    headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=3600" },
  });
};
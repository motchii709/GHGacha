interface Env {
  GHGACHA_CACHE: KVNamespace;
}

async function fetchRepoDetail(owner: string, name: string): Promise<any> {
  const [repoRes, readmeRes] = await Promise.all([
    fetch(`https://api.github.com/repos/${owner}/${name}`, {
      headers: { Accept: "application/vnd.github.v3+json", "User-Agent": "GHGacha/1.0" },
    }),
    fetch(`https://api.github.com/repos/${owner}/${name}/readme`, {
      headers: { Accept: "application/vnd.github.v3.raw", "User-Agent": "GHGacha/1.0" },
    }),
  ]);

  if (!repoRes.ok) {
    throw new Error(`GitHub API error: ${repoRes.status}`);
  }

  const repo = await repoRes.json();
  let readme: string | null = null;
  if (readmeRes.ok) {
    readme = await readmeRes.text();
    const lines = readme.split("\n");
    readme = lines.slice(0, 30).join("\n");
  }

  return { ...repo, readme };
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const pathParts = url.pathname.split("/").filter(Boolean);
  const owner = pathParts[pathParts.length - 2];
  const name = pathParts[pathParts.length - 1];

  if (!owner || !name) {
    return new Response(JSON.stringify({ error: "Missing owner or repo name" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const cacheKey = `repo:${owner}/${name}`;
  const cached = await context.env.GHGACHA_CACHE.get(cacheKey);
  if (cached) {
    return new Response(cached, {
      headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=3600" },
    });
  }

  try {
    const detail = await fetchRepoDetail(owner, name);
    const data = JSON.stringify(detail);
    await context.env.GHGACHA_CACHE.put(cacheKey, data, { expirationTtl: 3600 });
    return new Response(data, {
      headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=3600" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
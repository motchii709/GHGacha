const LANGUAGES = [
  "TypeScript", "JavaScript", "Python", "Rust", "Go", "Ruby", "Java",
  "Kotlin", "Swift", "C", "C++", "C#", "PHP", "Scala", "Dart",
  "Lua", "Zig", "Elixir", "Haskell", "OCaml",
];

export const onRequest: PagesFunction<{ GHGACHA_CACHE: KVNamespace }> = async (context) => {
  const cacheKey = "languages";
  const cached = await context.env.GHGACHA_CACHE.get(cacheKey);
  if (cached) {
    return new Response(cached, {
      headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=3600" },
    });
  }
  const data = JSON.stringify(LANGUAGES);
  await context.env.GHGACHA_CACHE.put(cacheKey, data, { expirationTtl: 3600 });
  return new Response(data, {
    headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=3600" },
  });
};
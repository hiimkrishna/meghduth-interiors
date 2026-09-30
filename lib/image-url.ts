// ছবি-উৎস সমাধান — DB-তে শুধু key থাকে (আপলোড করা ফাইল), দেখানোর সময় URL বানাতে হয়।
// নিয়ম: `/` বা `http(s)://` দিয়ে শুরু হলে যেমন আছে তেমন; নইলে local আপলোড (`/uploads/<key>`)।
// খালি/অনুপস্থিত → undefined (কম্পোনেন্ট ফলব্যাক দেখায়, next/image কখনো খালি src পায় না)।
export function resolveImageSrc(src: string | undefined | null): string | undefined {
  if (src === undefined || src === null) return undefined;
  const trimmed: string = src.trim();
  if (trimmed === "") return undefined;
  if (
    trimmed.startsWith("/") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }
  const safe: string = trimmed.replace(/\\/g, "/").split("/").pop() ?? "";
  const cleaned: string = safe.replace(/[^a-zA-Z0-9._-]/g, "");
  if (cleaned === "" || cleaned === "." || cleaned === "..") return undefined;
  return `/uploads/${cleaned}`;
}

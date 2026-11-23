
import * as cheerio from "cheerio";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

function isPublicIp(address) {
  // Conservative check: accept only globally routable
  // IPv4 addresses for this learning implementation.
  if (isIP(address) !== 4) return false;

  const parts = address.split(".").map(Number);
  const [a, b, c] = parts;

  if (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    a >= 224 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 192 && b === 0 && c === 0) ||
    (a === 192 && b === 0 && c === 2) ||
    (a === 198 && (b === 18 || b === 19)) ||
    (a === 198 && b === 51 && c === 100) ||
    (a === 203 && b === 0 && c === 113)
  ) {
    return false;
  }

  return true;
}

export async function extractUrlText(url) {
  const parsedUrl = new URL(url);

  if (!["https:", "http:"].includes(parsedUrl.protocol)) {
    throw new Error("Only HTTP and HTTPS URLs are supported");
  }

  // Basic protection against local/private network URLs.
  // Not sufficient alone for a production SSRF defense.
  const addresses = await lookup(parsedUrl.hostname, {
    all: true,
  });

  if (
    !addresses.length ||
    addresses.some(({ address }) => !isPublicIp(address))
  ) {
    throw new Error("Private or unsupported network address");
  }

  const response = await fetch(parsedUrl, {
    signal: AbortSignal.timeout(15000),
    redirect: "error",
    headers: {
      "User-Agent": "RAGKnowledgeAssistant/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.status}`);
  }

  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("text/html")) {
    throw new Error("URL does not return HTML content");
  }

  const maxBytes = 2 * 1024 * 1024;
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let html = "";
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      totalBytes += value.byteLength;

      if (totalBytes > maxBytes) {
        throw new Error("Webpage exceeds the 2 MB limit");
      }

      html += decoder.decode(value, { stream: true });
    }

    html += decoder.decode();
  } finally {
    await reader.cancel().catch(() => {});
  }

  const $ = cheerio.load(html);

  $("script, style, nav, footer, header, noscript, svg").remove();

  const title = $("title").first().text().trim() || parsedUrl.hostname;

  const mainContent = $("main").first();

  const text = (mainContent.length ? mainContent : $("body"))
    .text()
    .replace(/\s+/g, " ")
    .trim();

  return {
    title,
    text,
    url: parsedUrl.href,
  };
}

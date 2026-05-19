export async function fetchFileContent(url: string): Promise<string> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(id);

    if (!res.ok) {
      throw new Error(`Non-200 response status: ${res.status}`);
    }

    return await res.text();
  } catch (err: any) {
    clearTimeout(id);
    throw new Error(`Failed to fetch file content from URL "${url}": ${err.message}`);
  }
}

function getEnv(key: string, fallback = ""): string {
	const val = import.meta.env[key] || fallback;
	return val;
}

const CMS_API_URL = (() => {
	const raw = getEnv("CMS_API_URL", "https://cms.hanifu.id");
	if (raw.startsWith("https://") || raw.startsWith("http://")) return raw;
	return `https://${raw}`;
})();
const CMS_ACCESS_CLIENT_ID = getEnv("CMS_ACCESS_CLIENT_ID");
const CMS_ACCESS_CLIENT_SECRET = getEnv("CMS_ACCESS_CLIENT_SECRET");

function isConfigured(): boolean {
	return !!(CMS_ACCESS_CLIENT_ID && CMS_ACCESS_CLIENT_SECRET);
}

function getHeaders(): Record<string, string> {
	return {
		"CF-Access-Client-Id": CMS_ACCESS_CLIENT_ID,
		"CF-Access-Client-Secret": CMS_ACCESS_CLIENT_SECRET,
	};
}

export interface CmsPostListItem {
	id: string;
	slug: string;
	title: string;
	cover_image: string | null;
	excerpt: string | null;
	published_at: string | null;
	updated_at: string;
}

export interface CmsPostListResponse {
	entries: CmsPostListItem[];
	total: number;
	page: number;
	limit: number;
}

export interface CmsTag {
	id: string;
	name: string;
	slug: string;
	count: number;
}

export interface CmsCategory {
	id: string;
	name: string;
	slug: string;
	count: number;
}

export interface CmsPostDetail {
	id: string;
	content_type_id: string;
	slug: string;
	title: string;
	status: string;
	locale: string;
	author_id: string | null;
	cover_image: string | null;
	excerpt: string | null;
	published_at: string | null;
	created_at: string;
	updated_at: string;
	deleted_at: string | null;
	data: {
		description?: string;
		tags?: string[];
		category?: string;
		lang?: string;
		updated?: string | null;
		markdown_body?: string;
		[key: string]: unknown;
	};
	tags: { name: string; slug: string }[];
	categories: { name: string; slug: string }[];
}

async function cmsFetch<T>(path: string): Promise<T> {
	if (!isConfigured()) {
		console.warn(
			`[cms-api] Not configured (missing CMS_ACCESS_CLIENT_ID or CMS_ACCESS_CLIENT_SECRET), returning empty data for: ${path}`,
		);
		return { entries: [], data: [], total: 0, page: 1, limit: 20 } as T;
	}

	const url = `${CMS_API_URL}${path}`;
	try {
		const res = await fetch(url, {
			headers: getHeaders(),
			signal: AbortSignal.timeout(15000),
		});
		const text = await res.text();
		try {
			return JSON.parse(text) as T;
		} catch {
			console.warn(`[cms-api] Non-JSON response from ${url}: ${text.substring(0, 200)}`);
			return { entries: [], data: [], total: 0, page: 1, limit: 20 } as T;
		}
	} catch (err) {
		console.warn(`[cms-api] Fetch failed for ${url}: ${err instanceof Error ? err.message : err}`);
		return { entries: [], data: [], total: 0, page: 1, limit: 20 } as T;
	}
}

export async function fetchPosts(params?: {
	page?: number;
	limit?: number;
	tag?: string;
	category?: string;
}): Promise<CmsPostListResponse> {
	const searchParams = new URLSearchParams();
	if (params?.page) searchParams.set("page", String(params.page));
	if (params?.limit) searchParams.set("limit", String(params.limit));
	if (params?.tag) searchParams.set("tag", params.tag);
	if (params?.category) searchParams.set("category", params.category);

	const query = searchParams.toString();
	const path = `/api/v1/public/content/post${query ? `?${query}` : ""}`;
	return cmsFetch<CmsPostListResponse>(path);
}

export async function fetchPostBySlug(slug: string): Promise<CmsPostDetail> {
	return cmsFetch<CmsPostDetail>(`/api/v1/public/content/post/${slug}`);
}

export async function fetchAllPosts(): Promise<CmsPostListItem[]> {
	const allPosts: CmsPostListItem[] = [];
	let page = 1;
	const limit = 100;

	while (true) {
		const res = await fetchPosts({ page, limit });
		allPosts.push(...res.entries);
		if (allPosts.length >= res.total || res.entries.length === 0) break;
		page++;
	}

	return allPosts;
}

export async function fetchTags(type?: string): Promise<{ data: CmsTag[] }> {
	const query = type ? `?type=${type}` : "";
	return cmsFetch<{ data: CmsTag[] }>(`/api/v1/public/tags${query}`);
}

export async function fetchCategories(
	type?: string,
): Promise<{ data: CmsCategory[] }> {
	const query = type ? `?type=${type}` : "";
	return cmsFetch<{ data: CmsCategory[] }>(`/api/v1/public/categories${query}`);
}

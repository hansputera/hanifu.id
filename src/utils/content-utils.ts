import { getCategoryUrl } from "@utils/url-utils.ts";
import {
	type CmsPostDetail,
	fetchCategories as cmsFetchCategories,
	fetchTags as cmsFetchTags,
	fetchAllPosts,
	fetchPostBySlug,
} from "./cms-api";

function computeReadingTime(markdown: string): {
	words: number;
	minutes: number;
} {
	const text = markdown
		.replace(/!\[.*?\]\(.*?\)/g, "")
		.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
		.replace(/<[^>]+>/g, "")
		.replace(/[#*`~>_]/g, "")
		.replace(/\n+/g, " ")
		.trim();
	const words = text ? text.split(/\s+/).length : 0;
	const minutes = Math.max(1, Math.round(words / 200));
	return { words, minutes };
}

function computeExcerpt(markdown: string): string {
	const lines = markdown.split("\n");
	for (const line of lines) {
		const trimmed = line.trim();
		if (
			trimmed &&
			!trimmed.startsWith("#") &&
			!trimmed.startsWith("::") &&
			!trimmed.startsWith(">") &&
			!trimmed.startsWith("```") &&
			!trimmed.startsWith("---")
		) {
			return trimmed
				.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
				.replace(/[*_`]/g, "")
				.substring(0, 200);
		}
	}
	return "";
}

export interface CmsPostForList {
	slug: string;
	data: {
		title: string;
		tags: string[];
		category: string | null;
		published: Date;
		updated?: Date;
		image: string;
		description: string;
		draft: boolean;
		lang?: string;
	};
	words: number;
	minutes: number;
	excerpt: string;
	nextSlug?: string;
	nextTitle?: string;
	prevSlug?: string;
	prevTitle?: string;
}

async function getRawSortedPosts(): Promise<CmsPostForList[]> {
	const items = await fetchAllPosts();

	const posts: CmsPostForList[] = [];

	for (const item of items) {
		let detail: CmsPostDetail | null = null;
		try {
			detail = await fetchPostBySlug(item.slug);
		} catch {
			// fallback to list data
		}

		const markdownBody = detail?.data?.markdown_body || "";
		const { words, minutes } = computeReadingTime(markdownBody);
		const excerpt = computeExcerpt(markdownBody);

		posts.push({
			slug: item.slug,
			data: {
				title: item.title,
				tags: detail?.data?.tags || [],
				category: detail?.data?.category || null,
				published: item.published_at ? new Date(item.published_at) : new Date(),
				updated: item.updated_at ? new Date(item.updated_at) : undefined,
				image: item.cover_image || "",
				description: item.excerpt || "",
				draft: false,
				lang: detail?.data?.lang || "",
			},
			words,
			minutes,
			excerpt,
		});
	}

	return posts;
}

export async function getSortedPosts(): Promise<CmsPostForList[]> {
	const sorted = await getRawSortedPosts();

	for (let i = 1; i < sorted.length; i++) {
		sorted[i].nextSlug = sorted[i - 1].slug;
		sorted[i].nextTitle = sorted[i - 1].data.title;
	}
	for (let i = 0; i < sorted.length - 1; i++) {
		sorted[i].prevSlug = sorted[i + 1].slug;
		sorted[i].prevTitle = sorted[i + 1].data.title;
	}

	return sorted;
}

export type PostForList = {
	slug: string;
	data: {
		title: string;
		tags: string[];
		category: string | null;
		published: Date;
	};
};

export async function getSortedPostsList(): Promise<PostForList[]> {
	const sortedFullPosts = await getRawSortedPosts();
	return sortedFullPosts.map((post) => ({
		slug: post.slug,
		data: {
			title: post.data.title,
			tags: post.data.tags,
			category: post.data.category,
			published: post.data.published,
		},
	}));
}

export type Tag = {
	name: string;
	count: number;
};

export async function getTagList(): Promise<Tag[]> {
	const { data } = await cmsFetchTags("post");
	return data.map((t) => ({ name: t.name, count: t.count }));
}

export type Category = {
	name: string;
	count: number;
	url: string;
};

export async function getCategoryList(): Promise<Category[]> {
	const { data } = await cmsFetchCategories("post");
	return data.map((c) => ({
		name: c.name,
		count: c.count,
		url: getCategoryUrl(c.name),
	}));
}

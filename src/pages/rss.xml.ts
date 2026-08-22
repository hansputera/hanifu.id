import rss from "@astrojs/rss";
import { fetchPostBySlug } from "@utils/cms-api";
import { getSortedPosts } from "@utils/content-utils";
import type { APIContext } from "astro";
import MarkdownIt from "markdown-it";
import sanitizeHtml from "sanitize-html";
import { siteConfig } from "@/config";

export const prerender = false;

const parser = new MarkdownIt();

function stripInvalidXmlChars(str: string): string {
	return str.replace(
		// biome-ignore lint/suspicious/noControlCharactersInRegex: https://www.w3.org/TR/xml/#charsets
		/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F\uFDD0-\uFDEF\uFFFE\uFFFF]/g,
		"",
	);
}

function stripDirectiveSyntax(str: string): string {
	return str.replace(/::\w+\{[^}]*\}/g, "");
}

export async function GET(context: APIContext) {
	const blog = await getSortedPosts();

	const items = [];
	for (const post of blog) {
		let content = "";
		try {
			const detail = await fetchPostBySlug(post.slug);
			content = detail.data?.markdown_body || "";
		} catch {
			content = "";
		}

		const cleanedContent = stripInvalidXmlChars(content);
		const cleanedDirectives = stripDirectiveSyntax(cleanedContent);
		items.push({
			title: post.data.title,
			pubDate: post.data.published,
			description: post.data.description || "",
			link: `/posts/${post.slug}/`,
			content: sanitizeHtml(parser.render(cleanedDirectives), {
				allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
			}),
		});
	}

	return rss({
		title: siteConfig.title,
		description: siteConfig.subtitle || "No description",
		site: context.site ?? "https://hanifu.id",
		items,
		customData: `<language>${siteConfig.lang}</language>`,
	});
}

import { GenericParamsWithRouteName, makeUrl, UntypedParams, OptionalProps } from "./routes";

interface BlogData {
	blogs: {[blogId: string]: {name: string}}
}

interface BlogsParams {
}

interface PostsParams {
	readonly blogId: string;
	readonly pageIndex: number;
}

export type Params =
	| GenericParamsWithRouteName<"blogs", BlogsParams>
	| GenericParamsWithRouteName<"posts", PostsParams>

const blogs = makeUrl("blogs", {
	make: (_params: BlogsParams) => "/",
	route: "/",
	parse: (_params: UntypedParams): BlogsParams => ({}),
	crumbTitle: () => "Blogs",
});


const posts = makeUrl("posts", {
	make: ({blogId, pageIndex = 0}: OptionalProps<PostsParams, "pageIndex">) =>
		`/blogs/${blogId}/pageIndex/${pageIndex}`,
	route: "/blogs/:blogId/pageIndex/:pageIndex",
	parse: (untypedParams: UntypedParams): PostsParams => ({
		blogId: untypedParams.blogId,
		pageIndex: parseInt(untypedParams.pageIndex),
	}),
	previousCrumb: (params) =>
		blogs.crumb(params, {}),
	crumbTitle: (params, additionalData: BlogData) => additionalData.blogs[params.blogId].name,
});

export const routes = {
	blogs,
	posts,
};

const blogData: BlogData = {blogs: {
	myBlog: {
		name: "My Blog"
	}
}};

console.log(routes.posts.make({blogId: "myBlog", pageIndex: 0}));
// "/blogs/myBlog/pageIndex/0"

console.log(routes.posts.parse({blogId: "myBlog", pageIndex: "0"}));
// {blogId: "myBlog", pageIndex: 0}

console.log(routes.posts.crumb({blogId: "myBlog", pageIndex: 0}, blogData));
/*
	[
		{title: "Blogs", href: "/"},
		{title: "My Blog", href: "/blogs/myBlog/pageIndex/0"}
	]
*/

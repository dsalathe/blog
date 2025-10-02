import { loadBlogPosts, loadBlogPost } from '../utils/blogLoader';

export const getBlogs = async (includeAllPosts = false) => {
  return await loadBlogPosts(includeAllPosts);
};

export const getBlogById = async (id, ignorePublishDate = false) => {
  return await loadBlogPost(id, ignorePublishDate);
};
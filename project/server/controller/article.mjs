import { join } from "node:path";
import { mReadFile, mWriteFile } from "../utils/file.mjs";
import { getPath } from "../utils/path.mjs";
import { generateUUID } from "../utils/uuid.mjs";

const { __dirname } = getPath(import.meta.url);

const ARTICLE_PATH = join(__dirname, "../../database", "article.json");

/**
 * 获取文章列表
 */
export function getArticles() {
  const articles = mReadFile(ARTICLE_PATH);
  return articles;
}

/**
 * 根据id查找文章
 * @param {*} id 
 * @returns 
 */
export function findArticleById(id) {
  const articles = mReadFile(ARTICLE_PATH);
  const article = articles.find(function (article) {
    return article.id === id;
  });
  return article;
}
/**
 * 添加文章
 * @param {*} article 
 * @returns 
 */
export function addArticle(data) {
  const id = generateUUID();
  const articles = mReadFile(ARTICLE_PATH);
  const article = {
    id,
    ...data
  }
  articles.unshift(article);
  mWriteFile(ARTICLE_PATH, articles);
  return article
}

export function deleteArticleById (id) {
  const articles = mReadFile(ARTICLE_PATH);
  mWriteFile(ARTICLE_PATH, articles.filter(item => item.id !== id));
  return 1
}
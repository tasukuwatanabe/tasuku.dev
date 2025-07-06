/**
 * ブログ記事のIDからクリーンなスラッグを生成する
 * @param id - ブログ記事のID（通常は.md拡張子を含むファイル名）
 * @returns 拡張子を除いたクリーンなスラッグ
 */
export function getCleanSlug(id: string): string {
  return id.replace(/\.md$/, '');
}

/**
 * ブログ記事のIDからブログURLを生成する
 * @param id - ブログ記事のID（通常は.md拡張子を含むファイル名）
 * @returns ブログ記事のURL
 */
export function getBlogUrl(id: string): string {
  return `/blog/${getCleanSlug(id)}/`;
}
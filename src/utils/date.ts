/**
 * 日付をYYYY/MM/DD形式の文字列にフォーマットする
 * @param date - フォーマットする日付
 * @returns YYYY/MM/DD形式の文字列
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}

/**
 * 文字列または日付をDate型に変換する
 * @param date - 変換する日付（文字列またはDate）
 * @returns Date型のオブジェクト
 */
export function parseDate(date: Date | string): Date {
  return typeof date === 'string' ? new Date(date) : date;
}

/**
 * 現在の年を取得する
 * @returns 現在の年（数値）
 */
export function getCurrentYear(): number {
  return new Date().getFullYear();
}
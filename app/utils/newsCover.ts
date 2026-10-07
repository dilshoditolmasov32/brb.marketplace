/**
 * The mock posts API has no pictures: a stock photo stands in until the backend sends covers.
 * The seed keeps the same picture for the same post on every page.
 */
export const newsCoverUrl = (postId: number, width = 640, height = 360) =>
  `https://picsum.photos/seed/brb-news-${postId}/${width}/${height}`

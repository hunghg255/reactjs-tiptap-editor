export interface IResGiphy {
  data: IDataGiphy[]
  meta: Meta
  pagination: Pagination
}

export interface IDataGiphy {
  type: string
  id: string
  url: string
  slug: string
  bitly_gif_url: string
  bitly_url: string
  embed_url: string
  username: string
  source: string
  title: string
  rating: string
  content_url: string
  source_tld: string
  source_post_url: string
  source_caption: string
  is_sticker: number
  import_datetime: string
  trending_datetime: string
  images: Images
  user?: User
  analytics_response_payload: string
  analytics: Analytics
  alt_text: string
  is_low_contrast: boolean
}

export interface Images {
  original: Original
  downsized: Downsized
  downsized_large: DownsizedLarge
  downsized_medium: DownsizedMedium
  downsized_small: DownsizedSmall
  downsized_still: DownsizedStill
  fixed_height: FixedHeight
  fixed_height_downsampled: FixedHeightDownsampled
  fixed_height_small: FixedHeightSmall
  fixed_height_small_still: FixedHeightSmallStill
  fixed_height_still: FixedHeightStill
  fixed_width: FixedWidth
  fixed_width_downsampled: FixedWidthDownsampled
  fixed_width_small: FixedWidthSmall
  fixed_width_small_still: FixedWidthSmallStill
  fixed_width_still: FixedWidthStill
  looping: Looping
  original_still: OriginalStill
  original_mp4: OriginalMp4
  preview: Preview
  preview_gif: PreviewGif
  preview_webp: PreviewWebp
  '480w_still': N480wStill
  hd?: Hd
}

export interface Original {
  height: string
  width: string
  size: string
  url: string
  mp4_size: string
  mp4: string
  webp_size: string
  webp: string
  frames: string
  hash: string
}

export interface Downsized {
  height: string
  width: string
  size: string
  url: string
}

export interface DownsizedLarge {
  height: string
  width: string
  size: string
  url: string
}

export interface DownsizedMedium {
  height: string
  width: string
  size: string
  url: string
}

export interface DownsizedSmall {
  height: string
  width: string
  mp4_size: string
  mp4: string
}

export interface DownsizedStill {
  height: string
  width: string
  size: string
  url: string
}

export interface FixedHeight {
  height: string
  width: string
  size: string
  url: string
  mp4_size: string
  mp4: string
  webp_size: string
  webp: string
}

export interface FixedHeightDownsampled {
  height: string
  width: string
  size: string
  url: string
  webp_size: string
  webp: string
}

export interface FixedHeightSmall {
  height: string
  width: string
  size: string
  url: string
  mp4_size: string
  mp4: string
  webp_size: string
  webp: string
}

export interface FixedHeightSmallStill {
  height: string
  width: string
  size: string
  url: string
}

export interface FixedHeightStill {
  height: string
  width: string
  size: string
  url: string
}

export interface FixedWidth {
  height: string
  width: string
  size: string
  url: string
  mp4_size: string
  mp4: string
  webp_size: string
  webp: string
}

export interface FixedWidthDownsampled {
  height: string
  width: string
  size: string
  url: string
  webp_size: string
  webp: string
}

export interface FixedWidthSmall {
  height: string
  width: string
  size: string
  url: string
  mp4_size: string
  mp4: string
  webp_size: string
  webp: string
}

export interface FixedWidthSmallStill {
  height: string
  width: string
  size: string
  url: string
}

export interface FixedWidthStill {
  height: string
  width: string
  size: string
  url: string
}

export interface Looping {
  mp4_size?: string
  mp4?: string
}

export interface OriginalStill {
  height: string
  width: string
  size: string
  url: string
}

export interface OriginalMp4 {
  height: string
  width: string
  mp4_size: string
  mp4: string
}

export interface Preview {
  height: string
  width: string
  mp4_size: string
  mp4: string
}

export interface PreviewGif {
  height: string
  width: string
  size: string
  url: string
}

export interface PreviewWebp {
  height: string
  width: string
  size: string
  url: string
}

export interface N480wStill {
  height: string
  width: string
  size: string
  url: string
}

export interface Hd {
  height: string
  width: string
  mp4_size: string
  mp4: string
}

export interface User {
  avatar_url: string
  banner_image: string
  banner_url: string
  profile_url: string
  username: string
  display_name: string
  description: string
  instagram_url: string
  website_url: string
  is_verified: boolean
}

export interface Analytics {
  onload: Onload
  onclick: Onclick
  onsent: Onsent
}

export interface Onload {
  url: string
}

export interface Onclick {
  url: string
}

export interface Onsent {
  url: string
}

export interface Meta {
  status: number
  msg: string
  response_id: string
}

export interface Pagination {
  total_count: number
  count: number
  offset: number
}

export interface GifItem {
  id: string;
  src: string;
  width: number;
  height: number;
}

export interface IResTenor {
  results: IDataTenor[]
  next: string
}

export interface IDataTenor {
  id: string
  title: string
  media_formats: MediaFormats
  created: number
  content_description: string
  itemurl: string
  url: string
  tags: string[]
  flags: string[]
  hasaudio: boolean
  content_description_source: string
}

export interface MediaFormats {
  mp4: Mp4
  loopedmp4: Loopedmp4
  nanogif: Nanogif
  nanomp4: Nanomp4
  tinygif: Tinygif
  tinywebm: Tinywebm
  webm: Webm
  mediumgif: Mediumgif
  nanowebm: Nanowebm
  nanogifpreview: Nanogifpreview
  tinymp4: Tinymp4
  gifpreview: Gifpreview
  tinygifpreview: Tinygifpreview
  gif: Gif
  webp: Webp
  nanowebppreview_transparent?: NanowebppreviewTransparent
  tinywebp_transparent?: TinywebpTransparent
  nanowebp_transparent?: NanowebpTransparent
  webp_transparent?: WebpTransparent
  webppreview_transparent?: WebppreviewTransparent
  tinywebppreview_transparent?: TinywebppreviewTransparent
}

export interface Mp4 {
  url: string
  duration: number
  preview: string
  dims: number[]
  size: number
}

export interface Loopedmp4 {
  url: string
  duration: number
  preview: string
  dims: number[]
  size: number
}

export interface Nanogif {
  url: string
  duration: number
  preview: string
  dims: number[]
  size: number
}

export interface Nanomp4 {
  url: string
  duration: number
  preview: string
  dims: number[]
  size: number
}

export interface Tinygif {
  url: string
  duration: number
  preview: string
  dims: number[]
  size: number
}

export interface Tinywebm {
  url: string
  duration: number
  preview: string
  dims: number[]
  size: number
}

export interface Webm {
  url: string
  duration: number
  preview: string
  dims: number[]
  size: number
}

export interface Mediumgif {
  url: string
  duration: number
  preview: string
  dims: number[]
  size: number
}

export interface Nanowebm {
  url: string
  duration: number
  preview: string
  dims: number[]
  size: number
}

export interface Nanogifpreview {
  url: string
  duration: number
  preview: string
  dims: number[]
  size: number
}

export interface Tinymp4 {
  url: string
  duration: number
  preview: string
  dims: number[]
  size: number
}

export interface Gifpreview {
  url: string
  duration: number
  preview: string
  dims: number[]
  size: number
}

export interface Tinygifpreview {
  url: string
  duration: number
  preview: string
  dims: number[]
  size: number
}

export interface Gif {
  url: string
  duration: number
  preview: string
  dims: number[]
  size: number
}

export interface Webp {
  url: string
  duration: number
  preview: string
  dims: number[]
  size: number
}

export interface NanowebppreviewTransparent {
  url: string
  duration: number
  preview: string
  dims: number[]
  size: number
}

export interface TinywebpTransparent {
  url: string
  duration: number
  preview: string
  dims: number[]
  size: number
}

export interface NanowebpTransparent {
  url: string
  duration: number
  preview: string
  dims: number[]
  size: number
}

export interface WebpTransparent {
  url: string
  duration: number
  preview: string
  dims: number[]
  size: number
}

export interface WebppreviewTransparent {
  url: string
  duration: number
  preview: string
  dims: number[]
  size: number
}

export interface TinywebppreviewTransparent {
  url: string
  duration: number
  preview: string
  dims: number[]
  size: number
}

export async function serviceGetTrendingGiphy (apiKey: string): Promise<GifItem[]> {
  const res = await fetch(`https://api.giphy.com/v1/gifs/trending?q=&limit=15&api_key=${apiKey}`);
  const r = await res.json() as IResGiphy;

  return r?.data?.map((it) => {
    return {
      id: it?.id,
      src: it?.images.original?.url,
      width: +it?.images.original?.width,
      height: +it?.images.original?.width
    };
  });
}

export async function serviceSearchGiphy (term: string, apiKey: string): Promise<GifItem[]> {
  const res = await fetch(`https://api.giphy.com/v1/gifs/search?q=${term}&limit=15&api_key=${apiKey}`);
  const r = await res.json() as IResGiphy;

  return r?.data?.map((it) => {
    return {
      id: it?.id,
      src: it?.images.original?.url,
      width: +it?.images.original?.width,
      height: +it?.images.original?.width
    };
  });
}

export async function serviceGetTrendingTenor (apiKey: string): Promise<GifItem[]> {
  const resTrend = await fetch(`https://tenor.googleapis.com/v2/trending_terms?key=${apiKey}&limit=10`);
  const rTrend = await resTrend?.json();

  const res = await fetch(`https://tenor.googleapis.com/v2/search?key=${apiKey}&q=${rTrend?.results?.[0]}&limit=15`);
  const r = await res.json() as IResTenor;

  return r?.results?.map((it) => {
    return {
      id: it?.id,
      src: it?.media_formats?.gif?.url,
      width: it?.media_formats?.gif?.dims?.[0],
      height: it?.media_formats?.gif?.dims?.[1],
    };
  });
}

export async function serviceSearchTenor (term: string, apiKey: string): Promise<GifItem[]> {
  const res = await fetch(`https://tenor.googleapis.com/v2/search?key=${apiKey}&q=${term}&limit=15`);
  const r = await res.json() as IResTenor;

  return r?.results?.map((it) => {
    return {
      id: it?.id,
      src: it?.media_formats?.gif?.url,
      width: it?.media_formats?.gif?.dims?.[0],
      height: it?.media_formats?.gif?.dims?.[1],
    };
  });
}

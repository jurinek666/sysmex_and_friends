import { MetadataRoute } from 'next'
import { getRecentPosts } from '@/lib/queries/posts'
import { getAlbums } from '@/lib/queries/albums'

// Define the base URL of the website
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://sysmex-friends.cz'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch data for dynamic routes
  // Fetching a large number of posts to approximate "all" posts as requested
  const posts = await getRecentPosts(1000)
  const albums = await getAlbums()

  // Define static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/tym`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/vysledky`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/galerie`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/playlisty`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/kalendar`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  // Define dynamic routes for posts
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const postRoutes: MetadataRoute.Sitemap = posts.map((post: any) => ({
    url: `${BASE_URL}/clanky/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(post.publishedAt),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  // Define dynamic routes for albums
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const albumRoutes: MetadataRoute.Sitemap = albums.map((album: any) => ({
    url: `${BASE_URL}/galerie/${album.id}`,
    lastModified: new Date(album.dateTaken || album.createdAt || new Date()),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  // Combine all routes
  return [...staticRoutes, ...postRoutes, ...albumRoutes]
}

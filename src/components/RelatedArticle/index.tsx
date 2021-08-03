import React, { FC, useMemo } from 'react'
import RelatedArticle from '@/components/RelatedArticle/RelatedArticle'
import type { ArticleHeadlineProps } from '@/components/ArticleHeadline/types'
import type { BlogPostBySlugQuery } from '@/../graphql-types'

type ArticlesMetaInfo = BlogPostBySlugQuery['allMdx']['nodes']

const flatArticleMetaInfo =
  (alt: string) =>
  ({ frontmatter, fields }: ArticlesMetaInfo[number]): ArticleHeadlineProps => {
    const { title, description, thumbnail, slug, date } = frontmatter!
    const { readingTime, lowerCaseTags } = fields!

    return {
      title: title!,
      description: description!,
      img: thumbnail!.childImageSharp?.gatsbyImageData,
      to: slug!,
      alt,
      lastUpdated: date,
      readingTime: readingTime?.text!,
      tags: lowerCaseTags!
    }
  }

const Index: FC<{
  recentArticles: ArticlesMetaInfo
  hotArticles: ArticlesMetaInfo
  sameTagArticles: ArticlesMetaInfo
  tags?: string[]
}> = ({ recentArticles, sameTagArticles, hotArticles, tags = [] }) => {
  const _recentArticles = useMemo<ArticleHeadlineProps[]>(
    () => recentArticles.map(flatArticleMetaInfo('recent article image')),
    [recentArticles]
  )

  const _hotArticles = useMemo<ArticleHeadlineProps[]>(
    () => hotArticles.map(flatArticleMetaInfo('hot article image')),
    [hotArticles]
  )

  const _sameTagArticles = useMemo<ArticleHeadlineProps[]>(
    () => sameTagArticles.map(flatArticleMetaInfo('same tag article image')),
    [sameTagArticles]
  )

  return (
    <RelatedArticle
      recentArticles={_recentArticles}
      hotArticles={_hotArticles}
      sameTagArticles={_sameTagArticles}
      tags={tags}
    />
  )
}

export default Index

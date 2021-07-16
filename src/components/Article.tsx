import React, { FC, ReactChild } from 'react'
import Breadcrumb from '@/components/Breadcrumb'
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image'
import timerSand from '@iconify-icons/mdi/timer-sand'
import Tag from '@/components/Tag'
import IconWith from '@/components/IconWith'
import { useCommentCount } from '@/components/Comment/CommentCount/hooks'
import CommentCounter from '@/components/Comment/CommentCount/CommentCounter'
import { handleClick } from '@/components/Comment/CommentCount/_util'
import ArticleDate from '@/components/ArticleDate'
import SnsShare from '@/components/SnsShare'
import Clap from '@/components/Clap'

interface ArticleProps {
  children: ReactChild
  title: string
  description: string
  hero: IGatsbyImageData
  relativePath: string
  slug: string
  readingTime: string
  tags: string[]
  date: string
  modifiedDate: string
  isModified: boolean
  url: string
}

const Article: FC<ArticleProps> = ({
  children,
  title,
  description,
  hero,
  relativePath,
  readingTime,
  tags,
  date,
  modifiedDate,
  isModified,
  slug,
  url
}) => {
  const [commentCount, loading] = useCommentCount()
  return (
    <article itemScope itemType="http://schema.org/Article" className="mx-auto">
      <div className="container morph xl:px-24 mx-auto mb-10 relative text-gray-800">
        <Breadcrumb to={relativePath} title={title} />
        <h1
          className="
          xl:text-9xl
          text-4xl
          sm:text-5xl
          md:text-6xl
          lg:text-8xl
          mb-4
          text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500
        "
        >
          {title}
        </h1>

        <p
          className="
          xl:mt-10
          text-gray-500
          dark:text-gray-100
          sm:text-xl
          md:text-2xl
          xl:text-3xl
        "
        >
          {description}
        </p>

        <div className="flex items-center justify-between my-2">
          <div className="space-x-4">
            {tags.map((tag) => (
              <Tag key={tag} tag={tag} />
            ))}
          </div>
          <div className="space-x-2 md:space-x-4">
            <SnsShare title={title} url={url} />
          </div>
        </div>

        <div
          className="flex justify-center flex-wrap text-gray-500 dark:text-gray-100
space-x-2 sm:space-x-4 md:space-x-8 my-6"
        >
          <span className="flex items-center">
            <ArticleDate
              publishAt={date}
              modifiedAt={modifiedDate}
              isModified={isModified}
            />
          </span>
          <span className="flex items-center">
            <IconWith
              icon={timerSand}
              className="text-accent w-6 h-6 md:w-7 md:h-7"
            >
              <span className="md:text-xl">{readingTime}</span>
            </IconWith>
          </span>

          <a href="#comment" className="flex" onClick={handleClick}>
            <CommentCounter value={commentCount} loading={loading} />
          </a>

          <Clap slug={slug} />
        </div>

        <GatsbyImage
          alt="hero image"
          className="rounded-md shadow"
          image={hero}
        />
      </div>

      {children}
    </article>
  )
}

export default Article

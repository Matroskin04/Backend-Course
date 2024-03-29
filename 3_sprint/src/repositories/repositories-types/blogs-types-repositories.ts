export type BlogType = {
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}

export type BlogTypeWithId = BlogType & {id: string}

export type BodyBlogType = {
    name: string
    description: string
    websiteUrl: string
}



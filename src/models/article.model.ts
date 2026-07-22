export interface NewArticle {
  title: string;
  description: string;
  body: string;
  tagList: string[];
}

export interface UpdateArticle {
  title?: string;
  description?: string;
  body?: string;
}

export interface ArticleAuthor {
  username: string;
  bio?: string | null;
  image?: string | null;
  following: boolean;
}

export interface Article {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
  author: ArticleAuthor;
}

export interface ArticleResponse {
  article: Article;
}
export interface SingleNewsResponseType {
  data: SingleNewsType;
}

export interface SingleNewsType {
  id: number;
  title: string;
  introduction: string;
  description: string;
  primary_image: string;
  copyright_primary_image: string;
  available_date: string;
  authors: Author[];
  gallery: Gallery[];
  related_news: RelatedNews[];
  tags: Tag[];
  categories: Category[];
  share_information: ShareInformation;
}

interface ShareInformation {
  description: string | null;
  url: string | null;
}

interface Author {
  id: number;
  name: string;
  callback_url: string;
  primary_image: string;
}

interface Gallery {
  url: string;
}

interface RelatedNews {
  id: string;
  title: string;
  thumbnail: string;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  is_primary: number;
}

export interface CategoryStory {
  title: string;
  deck: string;
  byline: string;
  image: string;
  slug?: string;
  date?: string;
  categoryTag?: string;
  category?: string;
}

export interface CategoryPageData {
  slug: string;
  name: string;
  description: string;
  lead: CategoryStory;
  sideStories: CategoryStory[];
  moreStories: CategoryStory[];
  totalPages?: number;
  currentPage?: number;
}


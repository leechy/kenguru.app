export interface CategoryInterface {
  id: number;
  description: string;
  name: string;
  slug: string;
  count: number;
  expanded: boolean;
  parent: number;
}

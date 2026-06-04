export interface MockProject {
  id: string;
  name: string;
  slug: string;
  isOwner: boolean;
}

export const MOCK_PROJECTS: MockProject[] = [
  {
    id: "proj-1",
    name: "AI Chat Interface",
    slug: "ai-chat-interface",
    isOwner: true,
  },
  {
    id: "proj-2",
    name: "Design System",
    slug: "design-system",
    isOwner: true,
  },
  {
    id: "proj-3",
    name: "Marketing Website",
    slug: "marketing-website",
    isOwner: false,
  },
];

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

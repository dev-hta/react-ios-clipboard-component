export type ClipType = "text" | "link" | "email" | "phone" | "code" | "color";

export type FilterKey = "all" | "pinned" | ClipType;

export interface Clip {
  id: string;
  content: string;
  type: ClipType;
  createdAt: number;
  lastUsed: number;
  pinned: boolean;
  copiedCount: number;
}

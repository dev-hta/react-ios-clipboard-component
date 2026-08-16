import {
  Type,
  Link2,
  Mail,
  Phone,
  KeyRound,
  Palette,
  type LucideIcon,
} from "lucide-react";
import type { ClipType } from "../types";

export interface TypeMeta {
  label: string;
  Icon: LucideIcon;
  /** gradient stops for the icon tile */
  from: string;
  to: string;
}

export const TYPE_META: Record<ClipType, TypeMeta> = {
  text: { label: "Text", Icon: Type, from: "#60a5fa", to: "#2563eb" },
  link: { label: "Link", Icon: Link2, from: "#a78bfa", to: "#7c3aed" },
  email: { label: "Email", Icon: Mail, from: "#fbbf24", to: "#d97706" },
  phone: { label: "Phone", Icon: Phone, from: "#f472b6", to: "#be185d" },
  code: { label: "Code", Icon: KeyRound, from: "#34d399", to: "#059669" },
  color: { label: "Color", Icon: Palette, from: "#f87171", to: "#e11d48" },
};

export const TYPE_ORDER: ClipType[] = [
  "text",
  "link",
  "email",
  "phone",
  "code",
  "color",
];

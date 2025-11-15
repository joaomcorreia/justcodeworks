export type HeaderBackgroundMode =
  | "none"
  | "particles";

export interface HeaderBackgroundConfig {
  key: HeaderBackgroundMode;
  label: string;
}

export const HEADER_BACKGROUNDS: HeaderBackgroundConfig[] = [
  { key: "none", label: "None" },
  { key: "particles", label: "Particles" },
];
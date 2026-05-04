export type StoredFile = {
  id: string;
  name: string;
  type: string;
  size: number;
  category: string;
  dataUrl: string;
  uploadedAt: number;
};

export type Stat = {
  id: string;
  label: string;
  value: string; // free-form text like "1 Year+", "6000+"
  suffix?: string;
};

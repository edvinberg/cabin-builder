export type ProjectStatus = "planning" | "in-progress" | "done";
export type PhaseStatus = "upcoming" | "active" | "done";
export type TaskStatus = "todo" | "in-progress" | "done";

export type LearningCategory =
  | "grund"
  | "stomme"
  | "tak"
  | "isolering"
  | "el"
  | "vvs"
  | "verktyg"
  | "övrigt";

export interface Image {
  id: string;
  dataUrl: string;
  caption: string;
  isDrawing: boolean;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  phases: Phase[];
  images: Image[];
}

export interface Phase {
  id: string;
  projectId: string;
  name: string;
  sortOrder: number;
  status: PhaseStatus;
  description: string;
  steps: Step[];
  materials: Material[];
  notes: Note[];
  links: Link[];
  images: Image[];
}

export interface Step {
  id: string;
  phaseId: string;
  text: string;
  sortOrder: number;
  done: boolean;
}

export interface Material {
  id: string;
  phaseId: string;
  name: string;
  quantity: number;
  unit: string;
  dimensions: string;
  costPerUnit: number;
  purchased: boolean;
  notes: string;
}

export interface Note {
  id: string;
  phaseId: string;
  text: string;
}

export interface Link {
  id: string;
  phaseId: string;
  title: string;
  url: string;
}

export interface Learning {
  id: string;
  projectId: string | null;
  projectName: string | null;
  title: string;
  body: string;
  category: LearningCategory;
  createdAt: string;
}

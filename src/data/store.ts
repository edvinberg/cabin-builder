import { useSyncExternalStore } from "react";
import type { Project, Phase, Material, Learning, LearningCategory } from "../types";
import type { ProjectTemplate } from "./templates";

const STORAGE_KEY = "cabin-builder";

function loadState(): { projects: Project[]; learnings: Learning[]; nextId: number } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

const saved = loadState();
let projects: Project[] = saved?.projects ?? [];
let learnings: Learning[] = saved?.learnings ?? [];
let listeners: Set<() => void> = new Set();
let nextId = saved?.nextId ?? 1000;

function id() {
  return `gen-${nextId++}`;
}

function emit() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ projects, learnings, nextId }));
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function findPhase(phaseId: string): Phase | undefined {
  for (const project of projects) {
    const phase = project.phases.find((p) => p.id === phaseId);
    if (phase) return phase;
  }
  return undefined;
}

function mutate() {
  projects = [...projects];
  emit();
}

function mutateLearnings() {
  learnings = [...learnings];
  emit();
}

// ── Hooks ──

export function useProjects(): Project[] {
  return useSyncExternalStore(subscribe, () => projects);
}

export function useProject(projectId: string): Project | undefined {
  const all = useProjects();
  return all.find((p) => p.id === projectId);
}

export function useLearnings(): Learning[] {
  return useSyncExternalStore(subscribe, () => learnings);
}

// ── Projects ──

export function addProject(name: string, description: string) {
  const project: Project = {
    id: id(),
    name,
    description,
    status: "planning",
    phases: [],
    images: [],
  };
  projects.push(project);
  mutate();
  return project.id;
}

export function addProjectFromTemplate(template: ProjectTemplate, name: string) {
  const projectId = id();
  const project: Project = {
    id: projectId,
    name,
    description: template.description,
    status: "planning",
    images: [],
    phases: template.phases.map((pt, i) => {
      const phaseId = id();
      return {
        id: phaseId,
        projectId,
        name: pt.name,
        sortOrder: i + 1,
        status: i === 0 ? "active" : "upcoming" as Phase["status"],
        description: pt.description,
        images: [],
        steps: pt.steps.map((text, j) => ({
          id: id(),
          phaseId,
          text,
          sortOrder: j + 1,
          done: false,
        })),
        materials: pt.materials.map((m) => ({
          id: id(),
          phaseId,
          ...m,
          purchased: false,
        })),
        notes: pt.notes.map((text) => ({
          id: id(),
          phaseId,
          text,
        })),
        links: pt.links.map((l) => ({
          id: id(),
          phaseId,
          ...l,
        })),
      };
    }),
  };
  projects.push(project);
  mutate();
  return projectId;
}

export function updateProject(projectId: string, fields: { name?: string; description?: string }) {
  const project = projects.find((p) => p.id === projectId);
  if (!project) return;
  if (fields.name !== undefined) project.name = fields.name;
  if (fields.description !== undefined) project.description = fields.description;
  mutate();
}

export function cycleProjectStatus(projectId: string) {
  const project = projects.find((p) => p.id === projectId);
  if (!project) return;
  const next = { planning: "in-progress", "in-progress": "done", done: "planning" } as const;
  project.status = next[project.status];
  mutate();
}

export function deleteProject(projectId: string) {
  projects = projects.filter((p) => p.id !== projectId);
  emit();
}

// ── Phases ──

export function addPhase(projectId: string, name: string, description: string) {
  const project = projects.find((p) => p.id === projectId);
  if (!project) return;
  const phase: Phase = {
    id: id(),
    projectId,
    name,
    sortOrder: project.phases.length + 1,
    status: "upcoming",
    description,
    steps: [],
    materials: [],
    notes: [],
    links: [],
    images: [],
  };
  project.phases.push(phase);
  mutate();
  return phase.id;
}

export function cyclePhaseStatus(phaseId: string) {
  const phase = findPhase(phaseId);
  if (!phase) return;
  const next = { upcoming: "active", active: "done", done: "upcoming" } as const;
  phase.status = next[phase.status];
  mutate();
}

export function updatePhase(phaseId: string, fields: { name?: string; description?: string }) {
  const phase = findPhase(phaseId);
  if (!phase) return;
  if (fields.name !== undefined) phase.name = fields.name;
  if (fields.description !== undefined) phase.description = fields.description;
  mutate();
}

export function deletePhase(phaseId: string) {
  for (const project of projects) {
    const idx = project.phases.findIndex((p) => p.id === phaseId);
    if (idx !== -1) {
      project.phases.splice(idx, 1);
      mutate();
      return;
    }
  }
}

// ── Steps ──

export function toggleStep(phaseId: string, stepId: string) {
  const phase = findPhase(phaseId);
  if (!phase) return;
  const step = phase.steps.find((s) => s.id === stepId);
  if (step) {
    step.done = !step.done;
    mutate();
  }
}

export function addStep(phaseId: string, text: string) {
  const phase = findPhase(phaseId);
  if (!phase) return;
  phase.steps.push({
    id: id(),
    phaseId,
    text,
    sortOrder: phase.steps.length + 1,
    done: false,
  });
  mutate();
}

export function updateStep(phaseId: string, stepId: string, text: string) {
  const phase = findPhase(phaseId);
  if (!phase) return;
  const step = phase.steps.find((s) => s.id === stepId);
  if (step) {
    step.text = text;
    mutate();
  }
}

export function deleteStep(phaseId: string, stepId: string) {
  const phase = findPhase(phaseId);
  if (!phase) return;
  phase.steps = phase.steps.filter((s) => s.id !== stepId);
  mutate();
}

// ── Materials ──

export function toggleMaterialPurchased(phaseId: string, materialId: string) {
  const phase = findPhase(phaseId);
  if (!phase) return;
  const material = phase.materials.find((m) => m.id === materialId);
  if (material) {
    material.purchased = !material.purchased;
    mutate();
  }
}

export interface MaterialInput {
  name: string;
  quantity: number;
  unit: string;
  dimensions: string;
  costPerUnit: number;
  notes: string;
}

export function addMaterial(phaseId: string, input: MaterialInput) {
  const phase = findPhase(phaseId);
  if (!phase) return;
  phase.materials.push({
    id: id(),
    phaseId,
    ...input,
    purchased: false,
  });
  mutate();
}

export function updateMaterial(phaseId: string, materialId: string, input: Partial<MaterialInput>) {
  const phase = findPhase(phaseId);
  if (!phase) return;
  const material = phase.materials.find((m) => m.id === materialId);
  if (material) {
    Object.assign(material, input);
    mutate();
  }
}

export function deleteMaterial(phaseId: string, materialId: string) {
  const phase = findPhase(phaseId);
  if (!phase) return;
  phase.materials = phase.materials.filter((m) => m.id !== materialId);
  mutate();
}

// ── Notes ──

export function addNote(phaseId: string, text: string) {
  const phase = findPhase(phaseId);
  if (!phase) return;
  phase.notes.push({ id: id(), phaseId, text });
  mutate();
}

export function updateNote(phaseId: string, noteId: string, text: string) {
  const phase = findPhase(phaseId);
  if (!phase) return;
  const note = phase.notes.find((n) => n.id === noteId);
  if (note) {
    note.text = text;
    mutate();
  }
}

export function deleteNote(phaseId: string, noteId: string) {
  const phase = findPhase(phaseId);
  if (!phase) return;
  phase.notes = phase.notes.filter((n) => n.id !== noteId);
  mutate();
}

// ── Links ──

export function addLink(phaseId: string, title: string, url: string) {
  const phase = findPhase(phaseId);
  if (!phase) return;
  phase.links.push({ id: id(), phaseId, title, url });
  mutate();
}

export function updateLink(phaseId: string, linkId: string, fields: { title?: string; url?: string }) {
  const phase = findPhase(phaseId);
  if (!phase) return;
  const link = phase.links.find((l) => l.id === linkId);
  if (link) {
    if (fields.title !== undefined) link.title = fields.title;
    if (fields.url !== undefined) link.url = fields.url;
    mutate();
  }
}

export function deleteLink(phaseId: string, linkId: string) {
  const phase = findPhase(phaseId);
  if (!phase) return;
  phase.links = phase.links.filter((l) => l.id !== linkId);
  mutate();
}

// ── Images (project-level) ──

export function addProjectImage(projectId: string, dataUrl: string, caption: string, isDrawing: boolean) {
  const project = projects.find((p) => p.id === projectId);
  if (!project) return;
  project.images.push({
    id: id(),
    dataUrl,
    caption,
    isDrawing,
    createdAt: new Date().toISOString().split("T")[0],
  });
  mutate();
}

export function deleteProjectImage(projectId: string, imageId: string) {
  const project = projects.find((p) => p.id === projectId);
  if (!project) return;
  project.images = project.images.filter((i) => i.id !== imageId);
  mutate();
}

// ── Images (phase-level) ──

export function addPhaseImage(phaseId: string, dataUrl: string, caption: string, isDrawing: boolean) {
  const phase = findPhase(phaseId);
  if (!phase) return;
  phase.images.push({
    id: id(),
    dataUrl,
    caption,
    isDrawing,
    createdAt: new Date().toISOString().split("T")[0],
  });
  mutate();
}

export function deletePhaseImage(phaseId: string, imageId: string) {
  const phase = findPhase(phaseId);
  if (!phase) return;
  phase.images = phase.images.filter((i) => i.id !== imageId);
  mutate();
}

// ── Learnings ──

export interface LearningInput {
  title: string;
  body: string;
  category: LearningCategory;
  projectId: string | null;
}

export function addLearning(input: LearningInput) {
  const project = input.projectId ? projects.find((p) => p.id === input.projectId) : null;
  learnings.push({
    id: id(),
    ...input,
    projectName: project?.name ?? null,
    createdAt: new Date().toISOString().split("T")[0],
  });
  mutateLearnings();
}

export function updateLearning(learningId: string, input: Partial<LearningInput>) {
  const learning = learnings.find((l) => l.id === learningId);
  if (!learning) return;
  if (input.title !== undefined) learning.title = input.title;
  if (input.body !== undefined) learning.body = input.body;
  if (input.category !== undefined) learning.category = input.category;
  if (input.projectId !== undefined) {
    learning.projectId = input.projectId;
    const project = input.projectId ? projects.find((p) => p.id === input.projectId) : null;
    learning.projectName = project?.name ?? null;
  }
  mutateLearnings();
}

export function deleteLearning(learningId: string) {
  learnings = learnings.filter((l) => l.id !== learningId);
  emit();
}

// ── Shopping list ──

export function getAllUnpurchasedMaterials() {
  const items: Array<{
    projectName: string;
    phaseName: string;
    phaseId: string;
    material: Material;
  }> = [];

  for (const project of projects) {
    for (const phase of project.phases) {
      for (const material of phase.materials) {
        if (!material.purchased) {
          items.push({
            projectName: project.name,
            phaseName: phase.name,
            phaseId: phase.id,
            material,
          });
        }
      }
    }
  }
  return items;
}

import { create } from "zustand";
import type { ArtifactType } from "@specforge/shared";

interface WorkspaceState {
  activeTab: ArtifactType | null;
  editMode: boolean;
  setActiveTab: (tab: ArtifactType) => void;
  setEditMode: (edit: boolean) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  activeTab: null,
  editMode: false,
  setActiveTab: (tab) => set({ activeTab: tab, editMode: false }),
  setEditMode: (edit) => set({ editMode: edit }),
}));

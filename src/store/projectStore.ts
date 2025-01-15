import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Project {
    _id: string;
    title: string;
    subTheme: string;
    description: string;
}

interface JuryProjectState {
    project: Project | null;
    jury: string;
    setJury: (jury: string) => void;
    setJuryProject: (project: Project) => void;
}

const useJuryStore = create<JuryProjectState>()(persist((set) => ({
    project: null,
    jury: "",
    setJury: (jury) => set({ jury }),
    setJuryProject: (project) => set({ project })
}), { name: 'jury' }))

export default useJuryStore
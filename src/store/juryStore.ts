import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface JuryAuthState {
    juryId: string;
    juryName: string;
    juryEmail: string;
    juryToken: string;
    juryRole: string;
    setJuryid: (juryId: string) => void;
    setJuryname: (juryName: string) => void;
    setJuryemail: (juryEmail: string) => void;
    setJuryToken: (juryToken: string) => void;
    setJuryRole: (juryRole: string) => void;
};

const useJuryAuthStore = create<JuryAuthState>()(
    persist(
        (set) => ({
            juryId: "",
            juryName: "",
            juryEmail: "",
            juryToken: "",
            juryRole: "",
            setJuryid: (juryId) => set({ juryId }),
            setJuryname: (juryName) => set({ juryName }),
            setJuryemail: (juryEmail) => set({ juryEmail }),
            setJuryToken: (juryToken) => set({ juryToken }),
            setJuryRole: (juryRole) => set({ juryRole })
        }),
        {
            name: 'chore'
        }
    )
);


export default useJuryAuthStore;
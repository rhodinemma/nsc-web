import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ParticipantState {
    username: string;
    email: string;
    token: string;
    setUsername: (username: string) => void;
    setUserEmail: (email: string) => void;
    setToken: (token: string) => void;
};

const useParticipantStore = create<ParticipantState>()(
    persist(
        (set) => ({
            username: "",
            email: "",
            token: "",
            setUsername: (username) => set({ username }),
            setUserEmail: (email) => set({ email }),
            setToken: (token) => set({ token })
        }),
        {
            name: 'participant'
        }
    )
);


export default useParticipantStore;
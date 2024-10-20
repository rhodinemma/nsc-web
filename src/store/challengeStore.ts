import { create } from 'zustand';

type ChallengeState = {
    currentChallenge: number;
    score: number;
    nextChallenge: () => void;
    incrementScore: () => void;
};

const useChallengeStore = create<ChallengeState>((set) => ({
    currentChallenge: 0,
    score: 0,
    nextChallenge: () => set((state) => ({ currentChallenge: state.currentChallenge + 1 })),
    incrementScore: () => set((state) => ({ score: state.score + 10 })),
}));

export default useChallengeStore;

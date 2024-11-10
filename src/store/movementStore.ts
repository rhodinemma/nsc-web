import {create} from 'zustand'

type CurrentPossibleMovement = {
    possible_direction: number;
}

type CurrentMovementState = {
    current_direction: number;
    possible_directions : CurrentPossibleMovement[];

}

const useCurrentMovementStore = create<CurrentMovementState & { setCurrentMovementState: (movement: CurrentMovementState) => void }>((set) => ({
    current_direction: 20,
    possible_directions: [],
    setCurrentMovementState: (movement: CurrentMovementState) => set((state) => ({...state, ...movement}))
}))

export default useCurrentMovementStore
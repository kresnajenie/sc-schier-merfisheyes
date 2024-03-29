import { BehaviorSubject } from 'rxjs';

const uiData = {
    isLoading: false,
    theme: 'light',
}

export const UIState = new BehaviorSubject(uiData);

/**
 * Updates the loading state within the UI state.
 * @param {boolean} isLoading - The new loading state to set.
 * Example Usage:
 * updateLoadingState(true); // To indicate loading has started
 * updateLoadingState(false); // To indicate loading has finished
 */
export function updateLoadingState(isLoading) {
    // Get the current state from the BehaviorSubject
    const currentState = UIState.getValue();

    // Update the items in the current state
    const updatedState = {
        ...currentState,
        isLoading: isLoading
    };

    // Emit the updated state
    UIState.next(updatedState);
}
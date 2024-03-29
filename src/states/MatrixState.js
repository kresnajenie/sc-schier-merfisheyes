import { BehaviorSubject } from 'rxjs';

const matrixData = {
    items: []
}

export const MatrixState = new BehaviorSubject(matrixData);

/**
 * Updates the items within the application's data state.
 * @param {Array} newItems - The new items to set in the state.
//  * Example Usage:
 * updateDataItems([{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }]);
 */
export function updateDataItems(newItems) {
    // Get the current state from the BehaviorSubject
    const currentState = MatrixState.getValue();

    // Update the items in the current state
    const updatedState = {
        ...currentState,
        items: newItems
    };

    // Emit the updated state
    MatrixState.next(updatedState);
}
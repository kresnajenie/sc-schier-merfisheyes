import { BehaviorSubject } from 'rxjs';

const selectedData = {
    selectedCelltypes: [],
    selectedGenes: []
}

export const SelectedState = new BehaviorSubject(selectedData);

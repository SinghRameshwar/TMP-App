import { combineReducers } from 'redux';

// Example reducer
const initialState = {
    data: null,
    loading: false,
    error: null,
};

function SDLStatusReducer(state = initialState, action) {
    switch (action.type) {
        case 'SDL_STATUS_REQUEST':
            return { ...state, loading: true, error: null };
        case 'SDL_STATUS_SUCCESS':
            return { ...state, loading: false, data: action.payload };
        case 'SDL_STATUS_FAILURE':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}


function SDLTASKListReducer(state = initialState, action) {
    switch (action.type) {
        case 'SDL_TSKLIST_REQUEST':
            return { ...state, loading: true, error: null };
        case 'SDL_TSKLIST_SUCCESS':
            return { ...state, loading: false, data: action.payload };
        case 'SDL_TSKLIST_FAILURE':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}


function MEDManagListReducer(state = initialState, action) {
    switch (action.type) {
        case 'MED_MANAGLIST_REQUEST':
            return { ...state, loading: true, error: null };
        case 'MED_MANAGLIST_SUCCESS':
            return { ...state, loading: false, data: action.payload };
        case 'MED_MANAGLIST_FAILURE':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}

function MEDDetailsReducer(state = initialState, action) {
    switch (action.type) {
        case 'MED_MANAGDTLS_REQUEST':
            return { ...state, loading: true, error: null };
        case 'MED_MANAGDTLS_SUCCESS':
            return { ...state, loading: false, data: action.payload };
        case 'MED_MANAGDTLS_FAILURE':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}

export default combineReducers({
    SDLStatusRedu: SDLStatusReducer,
    SDLTASKListRedu: SDLTASKListReducer,
    MEDManagListRedu: MEDManagListReducer,
    MEDDetailsRedu: MEDDetailsReducer
});


/* ----------SDL Status Log History Action ---------- */
export const requestSDLService = () => ({
    type: "SDL_STATUS_REQUEST",
 });

 export const fetchedSDLService = (data) =>({
    type:"SDL_STATUS_SUCCESS",
    payload: data
 })

 export const gotErrorSDLService = (data) =>({
   type:"SDL_STATUS_FAILURE",
   payload: data
})


/* ----------SDL Task LIst History Action ---------- */
export const requestSDLTskListService = (data) => ({
   type: "SDL_TSKLIST_REQUEST",
   payload: data
});

export const fetchedSDLTskListService = (data) =>({
   type:"SDL_TSKLIST_SUCCESS",
   payload: data
})

export const gotErrorSDLTskListService = (data) =>({
  type:"SDL_TSKLIST_FAILURE",
  payload: data
})


/* ----------MED Managament List Action ---------- */
export const requestMEDManagListService = (data) => ({
   type: "MED_MANAGLIST_REQUEST",
   payload: data
});

export const fetchedMEDManagListService = (data) =>({
   type:"MED_MANAGLIST_SUCCESS",
   payload: data
})

export const gotErrorMEDManagListService = (data) =>({
  type:"MED_MANAGLIST_FAILURE",
  payload: data
})


/* ----------MED Managament List Action ---------- */
export const requestMEDDetilService = (data) => ({
   type: "MED_MANAGDTLS_REQUEST",
   payload: data
});

export const fetchedMEDDetilService = (data) =>({
   type:"MED_MANAGDTLS_SUCCESS",
   payload: data
})

export const gotErrorMEDDetilService = (data) =>({
  type:"MED_MANAGDTLS_FAILURE",
  payload: data
})



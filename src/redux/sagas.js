import { takeLatest, call, put, all } from 'redux-saga/effects';
import { SDLClockinStatusApi } from '../common/services/SDLClockinStatusApi';
import { fetchedMEDDetilService, fetchedMEDManagListService, fetchedSDLService, fetchedSDLTskListService, gotErrorMEDDetilService, gotErrorMEDManagListService, gotErrorSDLService, gotErrorSDLTskListService } from './action';
import { SDLListApiCall } from '../common/services/SDLListApiCall';
import { MEDMagListApi } from '../common/services/MEDMagListApi';
import { MEDMagSchedulesDetailsApi } from '../common/services/MEDMagSchedulesDetailsApi';
import { medManagmentDetailsSave, medManagmentListSave } from '../common/Helpers/AsyncLocalSave';

//SDL Status Log Sagas
function* fetchData() {
    try {
        const data = yield SDLClockinStatusApi();
        yield put(fetchedSDLService({ type: 'SDL_STATUS_SUCCESS', payload: data }));
    } catch (error) {
        yield put(gotErrorSDLService({ type: 'SDL_STATUS_FAILURE', payload: error.message }));
    }
}


//SDL TASK List Sagas
function* fetchDataSDLTaskList({ payload }) {
    try {
        const data = yield SDLListApiCall(payload);
        yield put(fetchedSDLTskListService({ type: 'SDL_TSKLIST_SUCCESS', payload: data }));
    } catch (error) {
        yield put(gotErrorSDLTskListService({ type: 'SDL_TSKLIST_FAILURE', payload: error.message }));
    }
}

//MED Managament List Sagas
function* fetchDataMEDManagList({ payload }) {
    try {
        const data = yield MEDMagListApi(payload);
        medManagmentListSave(payload, data);
        yield put(fetchedMEDManagListService({ type: 'MED_MANAGLIST_SUCCESS', payload: data }));
    } catch (error) {
        yield put(gotErrorMEDManagListService({ type: 'MED_MANAGLIST_FAILURE', payload: error.message }));
    }
}

//MED Managament Details Sagas
function* fetchDataMEDmanagDetails({ payload }) {
    try {
        const data = yield MEDMagSchedulesDetailsApi(payload);
        medManagmentDetailsSave(payload, data);
        yield put(fetchedMEDDetilService({ type: 'MED_MANAGDTLS_SUCCESS', payload: data }));
    } catch (error) {
        yield put(gotErrorMEDDetilService({ type: 'MED_MANAGDTLS_FAILURE', payload: error.message }));
    }
}


// Watcher saga
function* watchFetchData() {
    yield takeLatest('SDL_STATUS_REQUEST', fetchData);
    yield takeLatest('SDL_TSKLIST_REQUEST', fetchDataSDLTaskList);
    yield takeLatest('MED_MANAGLIST_REQUEST', fetchDataMEDManagList);
    yield takeLatest('MED_MANAGDTLS_REQUEST', fetchDataMEDmanagDetails);
}


// Root saga
export default function* rootSaga() {
    yield all([
        watchFetchData(),
    ]);
}

import {call, put, takeEvery} from "redux-saga/effects";
import {SagaIterator} from "redux-saga";
import {fetchFeatureToggles} from "../../../nav-soknad/utils/rest-utils";
import {FeatureTogglesActionTypeKeys} from "./featureTogglesTypes";
import {henterFeaturetoggles, hentFeatureTogglesFeilet, mottattFeatures} from "./featureTogglesActions";
import {loggAdvarsel} from "../navlogger/navloggerActions";

function* hentFeatureTogglesSaga(): SagaIterator {
    try {
        yield put(henterFeaturetoggles());
        const response = yield call(fetchFeatureToggles);
        if (typeof response != "undefined") {
            yield put(mottattFeatures(response));
        }
    } catch (reason) {
        yield put(loggAdvarsel("Problemer med å hente featuretoggles: " + reason.toString()));
        yield put(hentFeatureTogglesFeilet(reason));
    }
}

function* featureTogglesSaga(): SagaIterator {
    yield takeEvery(FeatureTogglesActionTypeKeys.INIT, hentFeatureTogglesSaga);
}

export default featureTogglesSaga;

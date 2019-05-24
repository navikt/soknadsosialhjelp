import { call, takeEvery, put } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";

import { ActionTypeKeys, NavLogInitAction } from "./navloggerTypes";
import { loggingTilServerFeilet, } from "./navloggerActions";
import { fetchPost } from "../../utils/rest-utils";

function* loggTilServerSaga(action: NavLogInitAction): SagaIterator {
	try {
		yield call(fetchPost, "informasjon/actions/logg", JSON.stringify(action.logEntry));
	} catch (reason) {
		yield put( loggingTilServerFeilet() );
	}
}

function* navloggerSaga(): SagaIterator {
	yield takeEvery(ActionTypeKeys.INIT, loggTilServerSaga);
}

export {
	loggTilServerSaga
};

export default navloggerSaga;

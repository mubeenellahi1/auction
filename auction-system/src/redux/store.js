import { createStore, combineReducers, applyMiddleware} from 'redux';
//import { compose } from 'redux';
import { createBrowserHistory } from 'history';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import reducers from './reducers';
import rootSaga from './sagas';
import { composeWithDevTools} from 'redux-devtools-extension';
//import { devToolsEnhancer } from 'redux-devtools-extension';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
 

const history = createBrowserHistory();
const sagaMiddleware = createSagaMiddleware();
const routeMiddleware = routerMiddleware(history);
const middlewares = [thunk, sagaMiddleware, routeMiddleware];
// const composeEnhancers =
//   typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
//     ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
//         // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
//         trace:true,
//       })
//     : compose;
const composeEnhancers = composeWithDevTools({trace:true});

const persistConfig = {
  key: 'root',
  storage,
}

const rootReducer = combineReducers({
  ...reducers,
  router: connectRouter(history),
})

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware(...middlewares))
);

const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);
export { store, history, persistor};

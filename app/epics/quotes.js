import * as fromQuotes from '../actions/quotes';

import { ajax } from 'rxjs/ajax';
import { of } from 'rxjs';
import { delay, tap, map, switchMap, mergeMap, catchError, distinctUntilKeyChanged } from 'rxjs/operators';

export const fetchQuotes = (action$) => 
  action$.ofType(fromQuotes.FETCH_QUOTES).pipe(
    switchMap(() => 
      fetchQ().pipe(
        map((result) => result.response),
        map(fromQuotes.loadQuotes),
        catchError((err) => console.log(err)),
      )),
  );

export const saveQuote = (action$) =>
  action$.ofType(fromQuotes.SAVE_QUOTE).pipe(
    tap((action) => `saveQuote: ${action}`),
    map((action) => action.payload),
    distinctUntilKeyChanged("text"),
    switchMap((quote) =>
      insertQ(quote).pipe(
        map((result) => result.response),
        map(fromQuotes.loadQuote),
      )), 
  );

export const toggleFavorite = (action$) =>
  action$.ofType(fromQuotes.TOGGLE_FAVORITE).pipe(
    map((action) => action.payload),
    switchMap(({ _id, text, favorited }) => 
      updateQ(_id, text, !favorited).pipe(
        map((result) => result.response),
        map(() => fromQuotes.loadQuote({_id, text, favorited: !favorited})),
      )),
  );

export const deleteQuote = (action$) =>
  action$.ofType(fromQuotes.DELETE_QUOTE).pipe(
      map((action) => action.payload),
      switchMap((quote) => 
        deleteQ(quote._id).pipe(
          map((result) => result.response),
          map(() => fromQuotes.deleteSuccess(quote._id)),
        )),
  );

// API endpoints
const fetchQ = () => ajax.get(`/api/quotes`)
const insertQ = (quote) => ajax.post(`/api/quotes`, quote)
const deleteQ = (id) => ajax.delete(`/api/quotes/${id}`)
const updateQ = (id, text, favorited) => of({}).pipe(delay(1000), mergeMap(() => ajax.patch(`/api/quotes/${id}`, { _id: id, text, favorited })))

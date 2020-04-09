import * as fromQuotes from '../actions/quotes';

import { ajax } from 'rxjs/ajax';
import { map, switchMap, catchError } from 'rxjs/operators';

export const fetchQuotes = (action$) => 
  action$.ofType(fromQuotes.FETCH_QUOTES).pipe(
    switchMap(() => 
      ajax.get('/api/quotes').pipe(
        map((result) => result.response),
        map(fromQuotes.loadQuotes),
        catchError((err) => console.log(err)),
      )),
  );

export const saveQuote = (action$) =>
  action$.ofType(fromQuotes.SAVE_QUOTE).pipe(
    map((action) => action.payload),
    switchMap((quote) =>
      ajax.post(`api/quotes`, quote).pipe(
        map((result) => result.response),
        map(fromQuotes.loadQuote),
      )), 
  );

export const toggleFavorite = (action$) =>
  action$.ofType(fromQuotes.TOGGLE_FAVORITE).pipe(
    map((action) => action.payload),
    switchMap(({ _id, text, favorited }) => 
      ajax.patch(`/api/quotes/${_id}`, {_id, text, favorited: !favorited}).pipe(
        map((result) => result.response),
        map(() => fromQuotes.loadQuote({_id, text, favorited: !favorited})),
      )),
  );

export const deleteQuote = (action$) =>
  action$.ofType(fromQuotes.DELETE_QUOTE).pipe(
      map((action) => action.payload),
      switchMap((quote) => 
        ajax.delete(`/api/quotes/${quote._id}`).pipe(
          map((result) => result.response),
          map(() => fromQuotes.deleteSuccess(quote._id)),
        )),
  );


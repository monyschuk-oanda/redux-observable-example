import * as fromQuotes from '../actions/quotes';

import { ajax } from 'rxjs/ajax';
import { of, empty } from 'rxjs';
import { delay, tap, map, switchMap, mergeMap, catchError, distinctUntilKeyChanged, mapTo } from 'rxjs/operators';

export const fetchQuotes = (action$) => 
  action$.ofType(fromQuotes.FETCH_QUOTES).pipe(
    mergeMap(() => empty())
  );

export const saveQuote = (action$) =>
  action$.ofType(fromQuotes.SAVE_QUOTE).pipe(
    mergeMap(() => empty())
  );

export const toggleFavorite = (action$) =>
  action$.ofType(fromQuotes.TOGGLE_FAVORITE).pipe(
    mergeMap(() => empty())
  );

export const deleteQuote = (action$) =>
  action$.ofType(fromQuotes.DELETE_QUOTE).pipe(
    mergeMap(() => empty())
  );

// API endpoints
const fetchQ = () => ajax.get(`/api/quotes`)
const insertQ = (quote) => ajax.post(`/api/quotes`, quote)
const deleteQ = (id) => ajax.delete(`/api/quotes/${id}`)
const updateQ = (id, text, favorited) => ajax.patch(`/api/quotes/${id}`, { _id: id, text, favorited })

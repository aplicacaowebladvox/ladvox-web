import {
  HttpBackend,
  HttpClient,
  HttpContext,
  HttpContextToken,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { dateParser, dateParserSend } from '../../modules/shared/utils/date.util';
import { UrlParameterModel } from '../models/url-parameter.model';

const GET = 'get';
const POST = 'post';
const PUT = 'put';
const PATCH = 'patch';
const DELETE = 'delete';
export const USE_AUTH_CONTEXT = new HttpContextToken<boolean>(() => true);
export const USE_CACHE_CONTEXT = new HttpContextToken<boolean>(() => false);
export const USE_LOG_CONTEXT = new HttpContextToken<boolean>(() => false);
export const USE_FAKE_BACKEND_CONTEXT = new HttpContextToken<boolean>(() => false);

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  private _apiUrl?: string;

  constructor(private http: HttpClient) {}

  get apiUrl(): string | undefined {
    return this._apiUrl;
  }

  set apiUrl(value: string | undefined) {
    this._apiUrl = value;
  }

  makeGet<T>(
    url: string,
    options: RequestInputOptions = {},
    ...params: UrlParameterModel[]
  ): Observable<T> {
    return this._makeRequest<T>(GET, this._getUrl(url, options.isBase, params), options);
  }

  makePost<T>(
    url: string,
    options: RequestInputOptions = {},
    ...params: UrlParameterModel[]
  ): Observable<T> {
    return this._makeRequest<T>(POST, this._getUrl(url, options.isBase, params), options);
  }

  makePut<T>(
    url: string,
    options: RequestInputOptions = {},
    ...params: UrlParameterModel[]
  ): Observable<T> {
    return this._makeRequest<T>(PUT, this._getUrl(url, options.isBase, params), options);
  }

  makePatch<T>(
    url: string,
    options: RequestInputOptions = {},
    ...params: UrlParameterModel[]
  ): Observable<T> {
    return this._makeRequest<T>(PATCH, this._getUrl(url, options.isBase, params), options);
  }

  makeDelete<T>(
    url: string,
    options: RequestInputOptions = {},
    ...params: UrlParameterModel[]
  ): Observable<T> {
    return this._makeRequest(DELETE, this._getUrl(url, options.isBase, params), options);
  }

  /**
   * Mount a request with attributes and options passed from stores.
   *
   * Consider the following:
   * - The "Authorization" header is handled by the AuthInterceptor
   * - The error response will be handled by ErrorInterceptor
   * - The body of the request will be adjusted to `<T>` expected in store.
   *
   * @param type: string
   * @param url: string
   * @param options: RequestInputOptions
   * @returns the observable with `response<T> body`, after make the HTTP request
   */
  private _makeRequest<T>(type: string, url: string, options: RequestInputOptions): Observable<T> {
    const contentType = options.contentType || 'application/json';
    let headers = options.headers ?? new HttpHeaders();

    if (options.useRaw !== false) {
      headers = headers.set('Content-Type', contentType);
    }

    let body = this._buildBodyRequest(contentType, options.data, options.useRaw);
    const request = this._buildRequest<T>(type, url, headers, body, options);
    return this._mappingBody<T>(request);
  }

  private _mappingBody<T>(request: Observable<HttpResponse<string>>): Observable<T> {
    return request.pipe(
      map((response) => {
        if (response?.body) {
          try {
            return JSON.parse(response.body, dateParser);
          } catch (errorParse) {
            console.log('[ERROR] - parsing [OK]-response to JSON error:', errorParse);
            return response.body;
          }
        }
        return null;
      })
    );
  }

  private _buildBodyRequest(
    contentType: string,
    data: Object | undefined,
    useRaw: boolean = false
  ): string | Object {
    let body = null;
    if (useRaw || contentType !== 'application/json') {
      body = data || '';
    } else {
      body = data ? JSON.stringify(data, dateParserSend) : '';
    }
    return body;
  }

  private _buildRequest<T>(
    type: string,
    url: string,
    headers: HttpHeaders,
    body: string | Object,
    options: RequestInputOptions
  ): Observable<HttpResponse<string>> {
    options.context = (options.context ?? new HttpContext())
      .set(USE_AUTH_CONTEXT, options?.useAuth ?? true)
      .set(USE_CACHE_CONTEXT, options.useCache || false)
      .set(USE_LOG_CONTEXT, options.useLog || false)
      .set(USE_FAKE_BACKEND_CONTEXT, options.useFakeBackend || false);

    let requestOptions: RequestCommonHttpOptions = {
      headers: headers,
      observe: 'response',
      responseType: 'text',
      context: options.context,
    };

    switch (type) {
      case GET:
        let ret = this.http.get(url, requestOptions);
        return ret;
      case POST:
        return this.http.post(url, body, requestOptions);
      case PUT:
        return this.http.put(url, body, requestOptions);
      case PATCH:
        return this.http.patch(url, body, requestOptions);
      case DELETE:
        return this.http.delete(url, requestOptions);
      default:
        throw new Error('Tipo de request inválido: ' + type);
    }
  }

  private _getUrl(action: string, isBase: boolean = false, params?: UrlParameterModel[]): string {
    let currentUrl: string = (isBase ? '' : this._apiUrl) + action;
    let isFirstRun: boolean = true;

    if (params?.length) {
      for (let param of params) {
        if (isFirstRun) {
          isFirstRun = false;
          currentUrl += `?${param.key}=${param.value}`;
        } else {
          currentUrl += `&${param.key}=${param.value}`;
        }
      }
    }

    return currentUrl;
  }
}

export interface RequestInputOptions {
  /** The data to be passed in body request */
  data?: Object;
  /** @default 'application/json' */
  contentType?: string;
  /** `true` if this URL is base of a complete URL. If true, is not the backend default API in the environment. @default `false` */
  isBase?: boolean;
  /** The optional header to be added in the request. Remember: the 'Content-Type' and 'Authorization' headers are added in other ways and will be replaced */
  headers?: HttpHeaders;
  /** This API needs authorization in backend? @default `false`  */
  useAuth?: boolean;
  /** This API can be cached? @default `true`  */
  useCache?: boolean;
  /** This API will be logged? @default `false`  */
  useLog?: boolean;
  /** This API will be mocked in fake-backend HttpInterceptor? @default `false`  */
  useFakeBackend?: boolean;
  /** The Angular 12+ way to pass additional information of the request to the Http Interceptors. See @see HttpContext */
  context?: HttpContext;
  useRaw?: boolean;
}

interface RequestCommonHttpOptions {
  headers?:
    | HttpHeaders
    | {
        [header: string]: string | string[];
      };
  observe: 'response';
  context?: HttpContext;
  params?:
    | HttpParams
    | {
        [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
      };
  reportProgress?: boolean;
  responseType: 'text';
  withCredentials?: boolean;
}

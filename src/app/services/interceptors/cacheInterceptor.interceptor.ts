import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { filter, shareReplay, tap } from "rxjs/operators";

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
    private cache: Map<string, HttpResponse<any>> = new Map();
    private CACHE_SIZE: number = 1;
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req);
        // POST/PUT/DELETE CAN CONTINUE WITHOUT CACHING
       /*  if (req.method !== 'GET')
            return next.handle(req);

        // Searching in map to see if we've got a previous request.
        const cachedResponse: HttpResponse<any> = this.cache.get(req.url);

        if (cachedResponse) {
            console.log('RESPONSE HAVE BEEN CACHED');
            return of(cachedResponse.clone()).pipe(
                tap(({ url, headers }: HttpResponse<any>) => this.removeCacheOnTimeCompleted(url, Number(headers.get('last-update')))))
        }

        return next.handle(req).pipe(
            filter((event: HttpEvent<any>) => event instanceof HttpResponse),
            tap((http: HttpResponse<any>) => this.cache.set(req.url, http.clone())),
            shareReplay(this.CACHE_SIZE)
        )
 */

    }

    private removeCacheOnTimeCompleted(url: string, time: number) {

       /*  const actualTime = new Date().getTime();

        if (actualTime >= time)
            this.cache.delete(url); */
    }

}
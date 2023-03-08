import { Injectable , ErrorHandler} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandlerService implements ErrorHandler {

  constructor() { }

  handleError(error: any): void {
    const chunkFailedMessage = /Loading chunk/;
    console.log('Error handler messages =>',error.message);
     if (chunkFailedMessage.test(error.message)) {
       console.log("Reiniciar dist");
       window.location.reload();
     }
   }

}

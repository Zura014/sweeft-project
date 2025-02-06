import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);

  return next(req).pipe(
    catchError((error) => {
      console.error('JSON Server Error:', error);

      let errorMessage =
        'An error occurred communicating with the JSON Server.';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
      } else if (error.status) {
        // Server-side error (JSON Server)
        // JSON Server usually returns a 500 with a more specific error in the body.
        // Try to extract it.
        if (error.error && error.error.message) {
          // Check for standard JSON Server error structure
          errorMessage = error.error.message;
        } else {
          errorMessage = `Server returned HTTP ${error.status}: ${error.statusText}`;
        }
      }

      toastr.error(errorMessage, 'Something went wrong!', {
        timeOut: 5000, // Duration (in milliseconds)
        positionClass: 'toast-bottom-right', // Position of the toast
        progressBar: true,
      });

      return throwError(() => new Error(errorMessage)); // Re-throw the error for the components
    })
  );
};

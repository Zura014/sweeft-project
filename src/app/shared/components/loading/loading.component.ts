import { Component } from '@angular/core';

@Component({
  selector: 'app-loading',
  template: `
    <div class="flex flex-col w-full gap-y-2 justify-center items-center">
      <h1 class="text-xl font-medium">LOADING</h1>
      <span class="loader"><span class="loader-inner"></span></span>
    </div>
  `,
  styles: `
  .loader {
      display: inline-block;
      width: 30px;
      height: 30px;
      position: relative;
      border: 4px solid blue;
      animation: loader 2s infinite ease;
    }
    
    .loader-inner {
      vertical-align: top;
      display: inline-block;
      width: 100%;
      background-color: blue;
      animation: loader-inner 2s infinite ease-in;
    }
    
    @keyframes loader {
      0% {
        transform: rotate(0deg);
      }
    
      25% {
        transform: rotate(180deg);
      }
    
      50% {
        transform: rotate(180deg);
      }
    
      75% {
        transform: rotate(360deg);
      }
    
      100% {
        transform: rotate(360deg);
      }
    }
    
    @keyframes loader-inner {
      0% {
        height: 0%;
      }
    
      25% {
        height: 0%;
      }
    
      50% {
        height: 100%;
      }
    
      75% {
        height: 100%;
      }
    
      100% {
        height: 0%;
      }
    }
  `,
})
export class LoadingComponent {}

import { Component, inject, signal } from '@angular/core';
import { EmployeeList } from './components/employee-list/employee-list';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { AsyncPipe } from '@angular/common';
import { environment } from '../environments/environment';
import { catchError, of, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [AsyncPipe, EmployeeList],
  standalone: true,
  template: `
  @if (auth.isAuthenticated$ | async; as session) {
    @if(session.isAuthenticated){
      <header>
        <button type="button" (click)="logout()"> Sign out </button>
      </header>
      @if (permissions$ | async; as permissions) {
        <app-employee-list [canWrite]="permissions.canWrite" />
      } 
      @else {
        <p role="status">Loading permissions...</p>
      }
    } @else {
        <main>
          <h1>Employee Management</h1>
          <p>Sign in to access employee records.</p>

          <button type="button" (click)="login()">Sign in</button>
        </main>
      }
  } 
  @else {
      <p role="status">Checking authentication...</p>
    }
  `
})
export class App {
  protected readonly title = signal('app-employee-list');
  private readonly http = inject(HttpClient);
  readonly auth = inject(OidcSecurityService);

  readonly permissions$ = this.auth.isAuthenticated$.pipe(
    switchMap(session =>
      session.isAuthenticated ? this.http.get<{ canWrite: boolean }>(environment.authMeUrl) : of({ canWrite: false })
    ),
    catchError(() => of({ canWrite: false }))
  );


  login(): void {
    this.auth.authorize();
  }
  logout(): void {
    this.auth.logoff().subscribe();
  }
}

import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginResponse } from '../models/login-response';
import { EmailRegisteredResponse } from '../models/email-registered-response';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  /**
   * Base URL for API endpoints
   */
  // private baseUrl = 'https://videoflix-backend.kakar.dev';
  private baseUrl = 'http://127.0.0.1:8000/';

  /**
   * Function to log in a user
   * @param email - User email
   * @param password - User password
   * @returns - Promise of LoginResponse
   */
  login(email: string, password: string) {
    const url = `${this.baseUrl}/api/auth/login/`;
    const headers = this.getHeaders();
    const body = { email, password };
    return lastValueFrom(this.http.post<LoginResponse>(url, body, { headers }));
  }

  /**
   * Function to register a new user
   * @param email - User email
   * @param password - User password
   * @returns - Promise of response
   */
  register(email: string, password: string) {
    const url = `${this.baseUrl}/api/auth/register/`;
    const headers = this.getHeaders();
    const body = { email, password };
    return lastValueFrom(this.http.post(url, body, { headers }));
  }

  /**
   * Function to reset a user's password
   * @param password - New password
   * @param uidb64 - User ID in base64 format
   * @param token - Reset token
   * @returns - Promise of response
   */
  resetPassword(password: string, uidb64: string | null, token: string | null) {
    const url = `${this.baseUrl}/api/auth/password-reset-complete/`;
    const headers = this.getHeaders();
    const body = { password, uidb64: uidb64 || '', token: token || '' };
    return lastValueFrom(this.http.patch(url, body, { headers }));
  }

  /**
   * Function to request a password reset email
   * @param email - User email
   * @returns - Promise of response
   */
  requestPasswordReset(email: string) {
    const url = `${this.baseUrl}/api/auth/password-reset/request/`;
    const headers = this.getHeaders();
    const body = { email };
    return lastValueFrom(this.http.post(url, body, { headers }));
  }

  /**
   * Function to check if an email is registered
   * @param email - Email to check
   * @returns - Promise of EmailRegisteredResponse
   */
  isEmailRegistered(email: string) {
    const url = `${this.baseUrl}/api/auth/email-check/`;
    const headers = this.getHeaders();
    const body = { email };
    return lastValueFrom(this.http.post<EmailRegisteredResponse>(url, body, { headers }));
  }

  /**
   * Function to check if the user is logged in
   * @returns - Boolean indicating login status
   */
  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  /**
   * Function to log out the user
   */
  logout() {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }

  /**
   * Generate HTTP headers for requests
   * @returns - HttpHeaders object
   */
  private getHeaders() {
    const csrfToken = this.getCookie('csrftoken');
    return new HttpHeaders({
      'X-CSRFToken': csrfToken,
      'Content-Type': 'application/json'
    });
  }

  /**
   * Retrieve a specific cookie value
   * @param name - Name of the cookie
   * @returns - Value of the cookie
   */
  private getCookie(name: string): string {
    let cookieValue = '';
    if (document.cookie) {
      const cookies = document.cookie.split(';');
      for (const cookie of cookies) {
        const [key, value] = cookie.trim().split('=');
        if (key === name) {
          cookieValue = decodeURIComponent(value);
          break;
        }
      }
    }
    return cookieValue;
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { VideoData } from '../models/video-data';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private apiBase = 'http://127.0.0.1:8000';
  private http = inject(HttpClient);
  videosAvailable: boolean = true;
  currentVideo: VideoData = {
    id: 1,
    title: '',
    description: '',
    thumbnail: '',
    category: '',
    created_at: '',
    new: false,
  };

  /**
   * Fetches the list of videos the user has started watching.
   */
  getOngoingVideos() {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiBase}/api/videos/video-progress/in_progress/`;
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return lastValueFrom(this.http.get(url, { headers }));
  }

  /**
   * Saves the user's video progress.
   */
  saveVideoProgress(videoId: number, progress: number) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiBase}/api/videos/video-progress/${videoId}/save_progress/`;
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return lastValueFrom(this.http.post(url, { last_position: progress }, { headers }));
  }

  /**
   * Retrieves all available videos from the backend.
   */
  fetchVideos() {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiBase}/api/videos/videos/`;
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return lastValueFrom(this.http.get(url, { headers }));
  }

    /**
   * Fetches a specific video by its title from the backend.
   * @param path - The title of the video.
   */
  fetchVideoById(id: string) {
    const token = localStorage.getItem('authToken');
    const url = `${this.apiBase}/api/videos/videos/${id}/`;
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return lastValueFrom(this.http.get(url, { headers }));
  }

  /**
   * Returns HTTP headers with CSRF token.
   */
  private getHeaders() {
    const csrfToken = this.getCsrfToken();
    return new HttpHeaders({
      'X-CSRFToken': csrfToken,
      'Content-Type': 'application/json'
    });
  }

  /**
   * Retrieves a specific cookie value.
   */
  private getCsrfToken(): string {
    let csrf = '';
    if (document.cookie) {
      const cookies = document.cookie.split(';');
      for (let cookie of cookies) {
        const [key, value] = cookie.trim().split('=');
        if (key === 'csrftoken') {
          csrf = decodeURIComponent(value);
          break;
        }
      }
    }
    return csrf;
  }
}

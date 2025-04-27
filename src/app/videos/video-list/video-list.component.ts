import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { VideoCollection } from '../../models/video-collection';
import { VideoService } from '../../services/video.service';
import { VideoData } from '../../models/video-data';
import { Router } from '@angular/router';

@Component({
  selector: 'app-video-list',
  imports: [MatButtonModule, CommonModule],
  templateUrl: './video-list.component.html',
  styleUrl: './video-list.component.scss'
})
export class VideoListComponent implements OnInit, AfterViewInit {
  cs = inject(VideoService);
  videoCollections: VideoCollection[] = [];
  selectedVideoId: number = 0;
  scrollDistance: number = 720;
  baseUrl = 'http://127.0.0.1:8000';
  // baseUrl = 'https://videoflix-backend.kakar.dev';
  sliderPositions: { [key: string]: number; } = {};
  visibleItemCount: number = 6;
  itemWidth: number = 0;

  constructor(private router: Router) { }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.calculateVisibleItems();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.calculateVisibleItems();
      this.initializeSliders();
    }, 100);
  }

  // Initialisiert alle Slider
  initializeSliders() {
    // Für "New on Videoflix" Kategorie
    if (this.getNewVideos().length > 0) {
      this.prepareSliderCategory('new');
    }

    // Für alle anderen Kategorien
    this.videoCollections.forEach(category => {
      if (category.videos.length > 0) {
        this.prepareSliderCategory(category.categoryName);
      }
    });
  }

  // Bereitet einen einzelnen Slider vor
  prepareSliderCategory(categoryName: string) {
    const track = this.getCategoryTrack(categoryName);
    if (track) {
      // Setze Anfangsposition auf 0
      if (this.getCategoryVideos(categoryName).length > this.getVisibleItemCount()) {
        this.sliderPositions[categoryName] = 0;

        // Initial Elemente duplizieren für unendliches Scrollen
        this.appendVideosForInfiniteScroll(categoryName);
      }
    }
  }

  // Fügt kontinuierlich Videos am Ende hinzu für unendliches Scrollen
  private appendVideosForInfiniteScroll(categoryName: string) {
    const trackElement = this.getCategoryTrack(categoryName);
    if (!trackElement) return;

    const track = trackElement;
    const videos = this.getCategoryVideos(categoryName);

    if (videos.length <= 0) return;

    // Wir fügen eine Kopie aller Videos ans Ende an
    videos.forEach((video, index) => {
      const existingItems = track.querySelectorAll('img');
      if (existingItems[index]) {
        const clone = existingItems[index].cloneNode(true) as HTMLElement;

        clone.addEventListener('click', () => {
          this.selectVideo(video);
        });

        track.appendChild(clone);
      }
    });
  }

  // Berechnet wie viele Videos auf einmal sichtbar sein sollen
  calculateVisibleItems() {
    // Finde alle Slider-Tracks
    const sliderTracks = document.querySelectorAll('.slider-track');
    if (sliderTracks.length > 0) {
      const containerWidth = sliderTracks[0].clientWidth;
      const imgElement = sliderTracks[0].querySelector('img');

      if (imgElement) {
        // Berechne die Breite eines Items inklusive Abstand
        const computedStyle = window.getComputedStyle(imgElement);
        const marginRight = parseInt(computedStyle.marginRight || '0');
        const marginLeft = parseInt(computedStyle.marginLeft || '0');

        this.itemWidth = imgElement.offsetWidth + marginRight + marginLeft + 16; // 16px ist der gap
        this.visibleItemCount = Math.floor(containerWidth / this.itemWidth);

        // Stelle sicher, dass mindestens 1 Item angezeigt wird
        this.visibleItemCount = Math.max(1, this.visibleItemCount);
      }
    }
  }

  // Gibt zurück wie viele Videos gleichzeitig angezeigt werden können
  getVisibleItemCount(): number {
    return this.visibleItemCount || 6;
  }

  // Prüft, ob ein Slider nach links gescrollt werden kann
  canScrollLeft(categoryName: string): boolean {
    // Wenn die Position nicht initialisiert ist oder 0, kann nicht nach links gescrollt werden
    return this.sliderPositions[categoryName] !== undefined && this.sliderPositions[categoryName] > 0;
  }

  // Scrollt die Kategorie nach links
  scrollLeft(categoryName: string): void {
    const scrollAmount = this.getVisibleItemCount() * this.itemWidth;
    const track = this.getCategoryTrack(categoryName);

    if (track) {
      // Initialisiere die Position, wenn nicht vorhanden
      if (this.sliderPositions[categoryName] === undefined) {
        this.sliderPositions[categoryName] = 0;
      }

      // Berechne die neue Position
      let newPosition = this.sliderPositions[categoryName] - scrollAmount;

      // Wenn wir am Anfang sind, nicht weiter scrollen
      if (newPosition < 0) {
        newPosition = 0;

        // Bei Bedarf Elemente duplizieren für kontinuierliches Scrollen
        this.appendVideosForInfiniteScroll(categoryName);
      }

      // Scrollen zum neuen Punkt
      track.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });

      // Speichere die neue Position
      this.sliderPositions[categoryName] = newPosition;
    }
  }

  // Scrollt die Kategorie nach rechts
  scrollRight(categoryName: string): void {
    const scrollAmount = this.getVisibleItemCount() * this.itemWidth;
    const track = this.getCategoryTrack(categoryName);

    if (track) {
      // Initialisiere die Position, wenn nicht vorhanden
      if (this.sliderPositions[categoryName] === undefined) {
        this.sliderPositions[categoryName] = 0;
      }

      const videos = this.getCategoryVideos(categoryName);

      // Berechne neue Position
      let newPosition = this.sliderPositions[categoryName] + scrollAmount;

      // Prüfe, ob wir nahe am Ende sind und mehr Elemente brauchen
      const totalWidth = track.scrollWidth;
      const visibleWidth = track.clientWidth;
      const maxScrollPosition = totalWidth - visibleWidth;

      // Wenn wir zu nah am Ende sind (weniger als 2 Bildschirme übrig), weitere Videos anhängen
      if (maxScrollPosition - newPosition < visibleWidth * 2) {
        this.appendVideosForInfiniteScroll(categoryName);
      }

      // Scrolle zur neuen Position
      track.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });

      // Aktualisiere die Slider-Position
      this.sliderPositions[categoryName] = newPosition;
    }
  }

  // Hilfsfunktion um den richtigen Track zu finden
  private getCategoryTrack(categoryName: string): HTMLElement | null {
    const categories = Array.from(document.querySelectorAll('.video-list > div'));

    if (categoryName === 'new') {
      const newCategory = categories.find(el => el.querySelector('h2')?.textContent?.trim() === 'New on Videoflix');
      return newCategory?.querySelector('.slider-track') as HTMLElement || null;
    } else {
      const category = categories.find(el => el.querySelector('h2')?.textContent?.trim() === categoryName);
      return category?.querySelector('.slider-track') as HTMLElement || null;
    }
  }

  // Hilfsfunktion um die richtigen Videos zu finden
  private getCategoryVideos(categoryName: string): VideoData[] {
    if (categoryName === 'new') {
      return this.getNewVideos();
    } else {
      const category = this.videoCollections.find(c => c.categoryName === categoryName);
      return category ? category.videos : [];
    }
  }

  selectVideo(video: VideoData) {
    this.cs.currentVideo = video;
    const videoDetail = document.querySelector('.video-detail') as HTMLElement;

    if (videoDetail) {
      videoDetail.style.setProperty('--bg-image', `url(${video.thumbnail})`);
    }

    if (window.matchMedia('(max-width: 768px)').matches) {
      this.playVideo(video);
    }
  }

  ngOnInit() {
    this.loadContent();
  }


  /**
   * Fetches video content from the backend.
   */
  loadContent() {
    const categoryMap = this.getCategoryMappings();
    const collections = this.createCollections();

    this.cs.fetchVideos()
      .then(data => this.sortVideos(data, categoryMap, collections))
      .catch(() => this.logout());

    this.cs.getOngoingVideos()
      .then(data => this.sortOngoingVideos(data, categoryMap, collections));

    this.videoCollections = collections;
  }

  /**
   * Returns category mappings.
   */
  private getCategoryMappings() {
    return {
      'new': 'New on Videoflix',
      'sci-fi': 'Sci-Fi',
      'fantasy': 'Fantasy',
      'comedy': 'Comedy',
      'started': 'Continue Watching'
    };
  }

  /**
   * Creates collections for sorting videos.
   */
  private createCollections(): VideoCollection[] {
    return Object.values(this.getCategoryMappings()).map(name => ({
      categoryName: name,
      videos: []
    }));
  }

  /**
   * Sorts videos into appropriate categories.
   */
  private sortVideos(data: any, categoryMap: any, collections: VideoCollection[]) {
    data.forEach((item: any) => {
      const video = this.mapVideoData(item);
      const collection = collections.find(c => c.categoryName === categoryMap[item.category]);
      if (collection) collection.videos.push(video);
    });
    this.selectRandomVideo();
  }

  /**
   * Sorts videos the user has started watching.
   */
  private sortOngoingVideos(data: any, categoryMap: any, collections: VideoCollection[]) {
    data.forEach((item: any) => {
      const video = this.mapVideoData({
        ...item.video,
        thumbnail: `${this.baseUrl}${item.video.thumbnail}`,
        new: false
      });
      const collection = collections.find(c => c.categoryName === categoryMap['started']);
      if (collection) collection.videos.push(video);
    });
  }

  /**
   * Maps backend video data to the frontend model.
   */
  private mapVideoData(item: any): VideoData {
    return {
      id: item.id,
      title: item.title,
      description: item.description,
      category: item.category,
      new: item.new || false,
      thumbnail: item.thumbnail,
      // video_file: `${this.baseUrl}/media/videos/${item.id}/master.m3u8`,
      created_at: item.created_at,
    };
  }

  /**
   * Selects a random video from the "New on Videoflix" category.
   */
  private selectRandomVideo() {
    const allVideos = this.videoCollections.flatMap(c => c.videos);

    if (allVideos.length > 0) {
      const randomVideo = allVideos[Math.floor(Math.random() * allVideos.length)];
      // Setze nur den aktuellen Video-Hintergrund, ohne playVideo aufzurufen
      this.cs.currentVideo = randomVideo;
      const videoDetail = document.querySelector('.video-detail') as HTMLElement;

      if (videoDetail) {
        videoDetail.style.setProperty('--bg-image', `url(${randomVideo.thumbnail})`);
      }
    } else {
      this.displayNoVideosMessage();
    }
  }

  /**
   * Displays message when no videos are available.
   */
  private displayNoVideosMessage() {
    this.cs.currentVideo.description = 'No videos available at the moment.';
    this.cs.videosAvailable = false;
  }

  /**
   * Logs out the user.
   */
  logout() {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }

  playVideo(video: VideoData) {
    this.router.navigate(['/videos', video.id]);
  }

  getNewVideos(): VideoData[] {
    return this.videoCollections
      .flatMap(category => category.videos)
      .filter(video => video.new);
  }
}

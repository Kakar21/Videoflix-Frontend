import { MatButtonModule } from '@angular/material/button';
import { Video } from '../../models/video';
import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
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
export class VideoListComponent implements OnInit, OnDestroy {
  cs = inject(VideoService);
  videoCollections: VideoCollection[] = [];
  selectedVideoId: number = 0;
  scrollDistance: number = 720;
  baseUrl = 'http://127.0.0.1:8000/';

  constructor(private router: Router) { }

  selectVideo(video: VideoData) {
    this.cs.currentVideo = video;
    const videoDetail = document.querySelector('.video-detail') as HTMLElement;

    if (videoDetail) {
      videoDetail.style.setProperty('--bg-image', `url(${video.thumbnail})`);
    }

    // this.scrollToPreview();
  }

  ngOnInit() {
    this.loadContent();
    // this.adjustScrollDistance();
    // window.addEventListener('resize', this.adjustScrollDistance.bind(this));
  }

  ngOnDestroy() {
    // window.removeEventListener('resize', this.adjustScrollDistance.bind(this));
  }


  // /**
  //  * Adjusts scroll distance based on screen width.
  //  */
  // adjustScrollDistance() {
  //   const width = window.innerWidth;
  //   if (width < 500) {
  //     this.scrollDistance = 240;
  //   } else if (width < 900) {
  //     this.scrollDistance = 360;
  //   } else if (width < 1275) {
  //     this.scrollDistance = 480;
  //   } else {
  //     this.scrollDistance = 720;
  //   }
  // }

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
      'documentary': 'Documentary',
      'drama': 'Drama',
      'romance': 'Romance',
      'started': 'Ongoing Videos'
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
      const video = this.mapVideoData(item.video);
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
    const newVideos = this.videoCollections.find(c => c.categoryName === 'New on Videoflix')?.videos;
    if (newVideos && newVideos.length) {
      this.cs.currentVideo = newVideos[Math.floor(Math.random() * newVideos.length)];
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

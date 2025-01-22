import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VgCoreModule, VgMediaElement } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { VideoService } from '../../services/video.service';
import { VideoData } from '../../models/video-data';

@Component({
  selector: 'app-video-player',
  imports: [
    CommonModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule
  ],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.scss'
})
export class VideoPlayerComponent implements OnInit {
  // @ViewChild(VgMediaElement, { static: true }) mediaElement!: VgMediaElement;  
  @ViewChild('media', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;
  videoId: string | null = null;
  currentVideo: VideoData = {
    id: 1,
    title: '',
    description: '',
    video_120p: '',
    video_360p: '',
    video_720p: '',
    video_1080p: '',
    thumbnail: '',
    category: '',
    created_at: '',
    new: false,
  };

  selectedQuality: keyof Pick<VideoData, 'video_120p' | 'video_360p' | 'video_720p' | 'video_1080p'> = 'video_720p'; 
  constructor(private route: ActivatedRoute, public videoService: VideoService, private router: Router) {}

  ngOnInit(): void {
    this.videoId = this.route.snapshot.paramMap.get('id');
    if (this.videoId) {
      this.loadVideo(this.videoId);
    }
  }

  /**
   * Fetches video details from the backend using the path.
   */
  loadVideo(id: string) {
    this.videoService.fetchVideoById(id)
      .then((videoData) => {
        this.currentVideo = videoData as VideoData;
        this.updateVideoSource();
        console.log(this.currentVideo);
      })
      .catch(() => {
        console.error('Video not found');
      });
  }

  /**
   * Aktualisiert die Videoquelle, wenn der Nutzer die Qualität wechselt.
   */
    updateVideoSource() {
      if (this.videoElement && this.videoElement.nativeElement) {
        this.videoElement.nativeElement.src = this.currentVideo[this.selectedQuality as keyof VideoData] as string;
        this.videoElement.nativeElement.load();
      }
    }

    /**
   * Ändert die Videoqualität.
   */
    changeQuality(event: Event) {
      this.selectedQuality = (event.target as HTMLSelectElement).value as keyof Pick<VideoData, 'video_120p' | 'video_360p' | 'video_720p' | 'video_1080p'>;
      this.updateVideoSource();
    }

  goBack() {
    this.router.navigate(['/videos']);
  }
}

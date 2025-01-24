import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
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
  progress: number = 0;
  lastPosition: number = 0;
  isMetadataLoaded: boolean = false; // Flag für geladenes Video

  selectedQuality: keyof Pick<VideoData, 'video_120p' | 'video_360p' | 'video_720p' | 'video_1080p'> = 'video_720p';
  constructor(private route: ActivatedRoute, public videoService: VideoService, private router: Router) { }

  ngOnInit(): void {
    this.videoId = this.route.snapshot.paramMap.get('id');
    if (this.videoId) {
      this.loadVideo(this.videoId);
    }
  }

  /**
   * Holt die Videodaten und setzt die letzte geschaut Position
   */
  loadVideo(id: string) {
    this.videoService.fetchVideoById(id)
      .then((videoData) => {
        this.currentVideo = videoData as VideoData;
        this.updateVideoSource();

        // Prüfe, ob es eine gespeicherte Position gibt
        this.videoService.getOngoingVideos().then((ongoingVideos: any) => {
          const ongoingVideo = ongoingVideos.find((v: any) => v.video.id === Number(id));
          if (ongoingVideo) {
            this.lastPosition = ongoingVideo.last_position;
            console.log(`Setze letzte Position auf: ${this.lastPosition}`);
          }
        });
      })
      .catch(() => {
        console.error('Video not found');
      });
  }

  updateVideoSource() {
    if (this.videoElement && this.videoElement.nativeElement && this.currentVideo) {
      this.videoElement.nativeElement.src = this.currentVideo[this.selectedQuality] as string;
      this.videoElement.nativeElement.load();

      // 🛑 Neu hinzugefügt: Flag zurücksetzen, weil wir das Video neu laden
      this.isMetadataLoaded = false;

      // ✅ Erst wenn das Video geladen ist, setzen wir die Position!
      this.videoElement.nativeElement.onloadedmetadata = () => {
        this.isMetadataLoaded = true;
        if (this.lastPosition > 0) {
          this.setVideoProgress();
        }
      };

      // 🛑 Neu hinzugefügt: Fortschritt alle 5 Sekunden speichern
      this.videoElement.nativeElement.ontimeupdate = () => {
        this.progress = (this.videoElement.nativeElement.currentTime / this.videoElement.nativeElement.duration) * 100;
        if (Math.floor(this.videoElement.nativeElement.currentTime) % 5 === 0) {
          this.saveProgress();
        }
      };
    }
  }


  setVideoProgress() {
    if (this.videoElement && this.videoElement.nativeElement && this.isMetadataLoaded) {
      console.log(`Setze Video-Progress auf ${this.lastPosition} Sekunden`);
      this.videoElement.nativeElement.currentTime = this.lastPosition;
    }
  }


  @HostListener('window:beforeunload', ['$event'])
  handleBeforeUnload() {
    this.saveProgress();
  }


  /**
* Speichert den Fortschritt des Videos
*/
  saveProgress() {
    if (this.videoElement && this.videoElement.nativeElement && this.videoId) {
      const currentTime = this.videoElement.nativeElement.currentTime;
      this.videoService.saveVideoProgress(Number(this.videoId), currentTime);
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

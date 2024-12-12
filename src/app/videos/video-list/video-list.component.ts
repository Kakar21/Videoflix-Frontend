import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Video } from '../../models/video';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-video-list',
  imports: [MatButtonModule, CommonModule],
  templateUrl: './video-list.component.html',
  styleUrl: './video-list.component.scss'
})
export class VideoListComponent {
  videoList: Video[] = [
    {
      title: 'Breakout',
      description: 'In a high-security prison, a wrongly convicted man formulates a meticulous plan to break out and prove his innocence. He must navigate a web of alliances and betrayals to reclaim his freedom and expose the truth.',
      image: 'assets/images/thumbnails/breakout.jpg',
      category: 'Drama'  
    },
    {
      title: 'Rhythms of Friendship',
      description: 'A group of friends, each with unique musical talents, come together to form a band. Through their shared passion for music, they learn the importance of friendship and teamwork.',
      image: 'assets/images/thumbnails/rhythms-of-friendship.jpg',
      category: 'Drama',
      new: true
    },
    {
      title: 'Majestic Whales',
      description: 'Explore the majestic world of whales, from their incredible migration patterns to their complex social structures. Witness the awe-inspiring behavior of these gentle giants.',
      image: 'assets/images/thumbnails/majestic-whales.jpg',
      category: 'Documentary',
      new: true
    },
    {
      title: 'Whispering Shadows',
      description: 'In a small coastal town, a mysterious figure haunts the local community. As the townspeople try to uncover the truth, they must navigate the dangerous secrets that lie beneath the surface of their idyllic community.',
      image: 'assets/images/thumbnails/whispering-shadows.jpg',
      category: 'Drama',
      new: true
    },
    {
      title: "Baby's secret language",
      description: 'A young girl discovers that she has the ability to communicate with animals. As she explores her newfound talent, she learns the importance of listening to nature and the natural world.',
      image: 'assets/images/thumbnails/babys-secret-language.jpg',
      category: 'Documentary',
      new: true
    },
    {
      title: 'World of Wonders',
      description: 'Explore the wonders of the natural world, from the smallest insects to the largest animals. Witness the incredible adaptations of these creatures and learn about the importance of biodiversity.',
      image: 'assets/images/thumbnails/world-of-wonders.jpg',
      category: 'Documentary',
      new: true
    },
    {
      title: '48 Hours to survive',
      description: 'A group of friends must survive for 48 hours in the wilderness after a plane crash. As they navigate the dangerous terrain, they must learn to work together and rely on their survival skills.',
      image: 'assets/images/thumbnails/48-hours-to-survive.jpg',
      category: 'Drama',
      new: true
    },
    {
      title: 'Chronicle of a Crime',
      description: 'A young detective investigates a series of murders in a small coastal town. As she delves deeper into the case, she must navigate the dangerous secrets that lie beneath the surface of her idyllic community.',
      image: 'assets/images/thumbnails/chronicle-of-a-crime.jpg',
      category: 'Drama',
    },
    {
      title: 'When i met you',
      description: 'A young woman discovers that she has the ability to communicate with animals. As she explores her newfound talent, she learns the importance of listening to nature and the natural world.',
      image: 'assets/images/thumbnails/when-i-met-you.jpg',
      category: 'Romance',
    },
    {
      title: 'Hate you?',
      description: 'A young woman discovers that she has the ability to communicate with animals. As she explores her newfound talent, she learns the importance of listening to nature and the natural world.',
      image: 'assets/images/thumbnails/hate-you.jpg',
      category: 'Romance',
    }
  ]

  getNewVideos(): Video[] {
    return this.videoList.filter(video => video.new);
  }
  
  getCategories(): { category: string; videos: Video[] }[] {
    const categoryMap: { [key: string]: Video[] } = {};

    this.videoList.forEach((video) => {
      if (!categoryMap[video.category]) {
        categoryMap[video.category] = [];
      }
      categoryMap[video.category].push(video);
    });

    return Object.keys(categoryMap).map((category) => ({
      category,
      videos: categoryMap[category],
    }));
  }
}


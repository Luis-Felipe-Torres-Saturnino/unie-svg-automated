# Quick notes about: Animations

## References
[Web Animation Performance Fundamentals](https://www.freecodecamp.org/news/web-animation-performance-fundamentals/)

## Quick Info
- Time to draw at 60FPS - 16.7ms
- Time to prepare drawing to paint - 10ms (acording to [RAIL](https://www.freecodecamp.org/news/content/images/size/w1600/2022/02/pipeline-1.png))

## Structure of animation

Order of painting frames:
<a href="https://www.freecodecamp.org/news/content/images/size/w1600/2022/02/pipeline-1.png">
<img src="https://www.freecodecamp.org/news/content/images/size/w1600/2022/02/pipeline-1.png">
</a>

1. JavaScript (detects and updates anything)
2. Recalculate Style - Way costly
3. Layout - Costly
4. Paint - Least costly
5. Composite Frame (New paint)

Cost of computing animation based on properties:

<a href="https://www.freecodecamp.org/news/content/images/size/w1600/2022/02/Twitter-post---55.png">
<img src="https://www.freecodecamp.org/news/content/images/size/w1600/2022/02/Twitter-post---55.png">
</a>
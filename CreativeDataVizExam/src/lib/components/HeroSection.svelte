<script>
  // You can add props or logic here if needed
</script>

<section class="hero">
  <video
    class="hero-bg"
    autoplay
    muted
    loop
    playsinline
    poster="/images/denmark-landscape.jpg"
  >
    <source src="/smoke-stack.mp4" type="video/mp4" />
    <!-- Add more <source> tags for other formats if needed -->
    Your browser does not support the video tag.
  </video>
  <div class="overlay">
    <h1>Green Promises,<br />Carbon Truths</h1>
    <h2>33 Years of CO₂ Emissions and Climate Policy</h2>
    <div class="scroll-indicator">
      <span>Scroll to begin</span>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 5v14M12 19l-5-5m5 5l5-5"
          stroke="#fff"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  </div>
</section>

<style>
  .hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
  }
  .hero::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
  .hero-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
  }
  .overlay {
    position: relative;
    z-index: 1;
    background: rgba(0, 0, 0, 0.45);
    color: #fff;
    padding: 3rem 2rem;
    border-radius: 1rem;
    text-align: center;
    box-shadow: 0 4px 32px rgba(0, 0, 0, 0.2);
  }
  h1 {
    font-size: 2.8rem;
    margin-bottom: 1rem;
    font-weight: 700;
    letter-spacing: 0.02em;
  }
  h2 {
    font-size: 1.5rem;
    font-weight: 400;
    margin-bottom: 2.5rem;
    opacity: 0.9;
  }
  .scroll-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.3rem;
    margin-top: 2rem;
    opacity: 0.85;
    animation: bounce 2s infinite;
  }
  .scroll-indicator span {
    font-size: 1rem;
    letter-spacing: 0.05em;
  }
  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(10px);
    }
  }
  @media (max-width: 600px) {
    h1 {
      font-size: 2rem;
    }
    h2 {
      font-size: 1.1rem;
    }
    .overlay {
      padding: 2rem 1rem;
    }
  }
</style>

<script>
  import { base } from '$app/paths';
</script>

<section class="intro">
  <div class="intro-content">
    <h2>Understanding Denmark's Carbon Footprint</h2>
    <p>
      Since 1990, Denmark has taken part in a global effort to address climate change.
      With a strong environmental reputation and progressive climate policies, it’s easy
      to assume Denmark is on the right track. But what do the numbers say?
    </p>
    <p>
      This project explores over 30 years of carbon dioxide (CO₂) emissions data across
      all sectors of Danish society — from industrial giants to individual households.
      We also look at the major climate policies introduced during this period, and
      ask: are they making a measurable difference?
    </p>
    <p>
      The data includes total CO₂ emissions from 1990 to 2023, broken down by sector,
      as well as a timeline of national and international climate policies affecting Denmark.
    </p>
    <h3>Before we dive in, consider:</h3>
    <ul>
      <li>Which sectors do you think are the biggest emitters?</li>
      <li>Have emissions gone down overall — or just shifted?</li>
      <li>What role do households like yours play in the bigger picture?</li>
    </ul>
    <p>
      Let’s begin by looking at how Denmark’s total CO₂ emissions have changed over time.
    </p>
  </div>
  <div class="intro-image">
    <img src="{base}/images/denmark-landscape.jpg" alt="Denmark landscape" />
  </div>
</section>

<style>
  .intro {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 3rem;
    background: #dde2e460;
    color: #222;
    padding: 4rem 2rem;
    min-height: 100vh;
  }
  .intro-content {
    flex: 1 1 350px;
    max-width: 600px;
  }
  .intro-content h2 {
    font-size: 2.2rem;
    margin-bottom: 1.2rem;
  }
  .intro-content h3 {
    font-size: 1.2rem;
    margin-top: 2rem;
    margin-bottom: 0.7rem;
    color: #0097a7;
    font-weight: 600;
  }
  .intro-content ul {
    margin: 1rem 0 1.5rem 0;
    padding-left: 1.2rem;
  }
  .intro-content p {
    margin-bottom: 1.1rem;
    line-height: 1.6;
  }
  .intro-image {
    flex: 1 1 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 250px;
  }
  .intro-image img {
    max-width: 900px;
    width: 100%;
    border-radius: 1rem;
    box-shadow: 0 4px 24px rgba(0,0,0,0.08);
    object-fit: cover;
  }
  @media (max-width: 900px) {
    .intro {
      flex-direction: column;
      padding: 2rem 1rem;
    }
    .intro-image img {
      max-width: 90vw;
    }
  }
</style>
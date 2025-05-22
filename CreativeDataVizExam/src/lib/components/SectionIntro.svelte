<script>
  import { base } from '$app/paths';
</script>

<section class="intro">
  <div class="intro-content">
    <h1>Fighting Climate Change</h1>
    <p class="intro-text">
      It all started with the first environmental United Nations' (UN) conference that was held in Stockholm (1972). 
      Here the first declaration of humans' responsibilities for the environment was stated. 
      Since then, many conferences<sup>*</sup> and agreements have taken place towards spreading awareness for nature and humans' impact on it:
    </p>
    <ul>
      <li><strong>1992 Rio de Janeiro</strong> - <em>The UN Conference on Environment and Development</em> 
        <br>
        <span class="resulting-in">Resulting in: <strong>Agenda 21</strong></span>
      </li>
      <li><strong>1997 Kyoto</strong> - <em>The UN Framework Convention on Climate Change</em>
        <br>
        <span class="resulting-in">Resulting in: <strong>The Kyoto Protocol</strong></span>
      </li>
      <li><strong>2015 Paris</strong> - <em>The UN Climate change Conference</em>
        <br>
        <span class="resulting-in">Resulting in: <strong>The Paris Agreement</strong></span>
      </li>
    </ul>
    <p class="footnote">
      <sup>*</sup><em>Many more conferences and agreements have occurred before, between, and after those mentioned above.</em>
    </p>
  </div>
  <div class="intro-image">
    <img src="{base}/images/UnitedNationsPic.png" alt="" />
  </div>
</section>

<style>
  .intro {
    display: flex;
    flex-wrap: wrap;
    /* align-items: center;
    justify-content: center; */
    gap: 3rem;
    padding: 4rem 2rem;
    min-height: 100vh;
  }
  .intro-content {
    flex: 1 1 350px;
    max-width: auto;
    margin: 3rem;
    margin-top: 17vh;
  }
  .intro-content h1 {
    font-size: 3.5rem;
    margin-bottom: 1.2rem;
  }
  .intro-text {
    font-size: 1.5rem;
    line-height: 1.5;
    margin-bottom: 2rem;
  }
  .intro-image {
    flex: 1 1 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 150px;
  }
  .intro-image img {
    max-width: 500px;
    width: 100%;
    border-radius: 1rem;
    object-fit: cover;
    z-index: 1;
  }
  ul li {
    margin-bottom: 1.2rem;
    font-size: 1.5rem;
  }
  .resulting-in {
    display: inline-block;
    margin-left: 2rem;
    margin-top: 0.5rem;
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
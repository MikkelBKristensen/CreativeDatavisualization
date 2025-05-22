<script>
  import { base } from "$app/paths";
</script>

<section class="intro">
  <div class="intro-content">
    <h1>The Danish Climate Act</h1>
    <p class="intro-text">
      In 2019 the “Agreement on climate law” was reached that Denmark should
      have a climate law. This law is known as the Climate Act and entered into
      force in 2020.
    </p>
    <p style="font-size: 1.8rem; margin-top: 5rem;"><strong>Key Points from the Climate Act</strong></p>
    <ul>
      <li>
        <strong>70% reduction</strong> of greenhouse emissions by <strong>2030</strong> compared to 1990
      </li>
       <li>
        <strong>Climate neutrality</strong> should be reached by <strong>2050</strong>
      </li>
       <li>
        Working towards keeping global temperature rise <strong>below 1.5 degrees Celcius*</strong>
        <br>
        <em class="resulting-in">*Is part of the Paris Agreement as well</em>
      </li>
    </ul>
  </div>
  <div class="intro-image">
    <img src="{base}/images/denmark-landscape.png" alt="Denmark landscape" />
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
    margin-top: 1rem;
    font-size: 1rem;
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

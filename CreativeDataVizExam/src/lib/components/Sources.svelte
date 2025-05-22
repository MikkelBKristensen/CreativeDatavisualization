<script>
  import { base } from "$app/paths";
</script>

<section class="sources-section">
  <div class="sources-content">
    <h2>Sources</h2>
    <p class="sources-desc">Below are the main sources used in this project:</p>
    <ul>
      <li>
        <a
          href="https://www.iea.org/countries/denmark"
          target="_blank"
          rel="noopener">International Energy Agency – Denmark</a>
      </li>
      <li>
        <a
          href="https://www.statbank.dk/statbank5a/default.asp?w=1920"
          target="_blank"
          rel="noopener">Statistics Denmark</a>
      </li>
      <!-- Add more sources here as <li> elements -->
    </ul>
  </div>
</section>

<style>
  .sources-section {
    background-color: #000000;
    color: #fff;
    min-height: 30vh;
    min-width: none;
    padding: 4rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: center; 
    height: 40vh;           
  }
  .sources-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center; 
    width: 100%;
    text-align: left;
    margin-left: 30rem;      
  }
  .sources-section h2 {
    margin-top: 0;
  }
  .sources-desc {
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
    color: #fff;
  }
  ul {
    margin: 0;
    padding-left: 1.2rem;
    color: #fff;
    text-align: left;
  }
  li {
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
    color: #fff;
  }
  a {
    color: #fff;
    text-decoration: underline;
  }
  a:hover {
    color: #ddd;
  }
</style>

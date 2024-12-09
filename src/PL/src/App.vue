<template>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
  <div id="app">
    
    
    <router-view /> <!-- This will show the current route's component -->


  </div>
</template>

<script>
import NavBar from './components/NavBar.vue';
import FooterSection from './components/FooterSection.vue';

document.addEventListener('wheel', function (event) {
  if (event.ctrlKey) {
    event.preventDefault(); // Disable zooming with Ctrl + scroll
  }
});

export default {
  name: 'App',
  components: {
    NavBar,
    
    FooterSection
  },
 
};
</script>

<style>
body {
  margin: 0;
  font-family: 'Roboto', sans-serif;
  background-color: rgb(83, 84, 83);
  color: white;
  min-width: 100vw; /* Prevent layout shrinking horizontally */
  overflow-x: hidden; /* Prevent horizontal scrolling */
  font-family: 'Roboto', sans-serif;

}

#app {
  text-align: center;
  

  
}
main{
  flex:1;
}

</style>
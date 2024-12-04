<template>
  <div class="about-contact">
    <NavBar />
    <AboutUs />
    <ContactUs />
    <FooterSection />
  </div>
</template>

<script>
import NavBar from "../components/NavBar.vue";
import AboutUs from "../components/AboutUs.vue";
import ContactUs from "../components/ContactUs.vue";
import FooterSection from "../components/FooterSection.vue";

export default {
  name: "AboutContact",
  components: {
    NavBar,
    AboutUs,
    ContactUs,
    FooterSection
  },
};
</script>

<style scoped>
.about-contact {
  display: flex;
  flex-direction: column;
  width: 100%; /* Fix width */
  margin: 0 auto; /* Center-align */
  margin-top: 65px;
}
</style>
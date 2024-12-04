<template>
  <div class="admin-page">
    <NavBar />
   
  
      <!-- Main Content -->
      <div class="content">
        <AdminPending />
        <!-- Add other components or content here in the future -->
      </div>
    
    <FooterSection />
  </div>
</template>

<script>
import AdminPending from '../components/AdminPending.vue';
import FooterSection from '../components/FooterSection.vue';
import NavBar from '../components/NavBar.vue';

export default {
  name: "AdminPage",
  components: {
    NavBar,
    AdminPending,
    FooterSection,
  },
};
</script>

<style scoped>
.admin-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.admin-layout {
  display: flex;
  flex: 1;
  padding: 20px;
  overflow: hidden;
}


.content {
  flex: 1;
  
  padding: 20px;
  border-radius: 8px;
  overflow-y: auto;
}
</style>
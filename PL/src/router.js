import { createRouter, createWebHistory } from 'vue-router';
import HomePage from './views/HomePage.vue';
import SignINUP from './views/SignINUP.vue';
import Services from './views/ServiceBooking.vue';
import AdminPage from './views/AdminPage.vue';
import axios from 'axios';

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/about', name: 'About', component: () => import('./views/ContactAboutPage.vue') }, 
  { 
    path: '/services', 
    name: 'Services', 
    component: Services, 
    meta: { requiresAuth: true }, 
  },
  { path: '/auth', name: 'SignInUp', component: SignINUP },
  { path: '/admin', name: 'Admin', component: AdminPage, meta: { requiresAuth: true, requiresAdmin: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

async function isAuthenticated() {
  try {
    const response = await axios.get('/api/auth/check', { withCredentials: true });
    return response.data.message === 'Authenticated';
  } catch (error) {
    return false;
  }
}

async function isAdmin() {
  try {
    const response = await axios.get('/api/auth/check', { withCredentials: true });
    return response.data.role === 'admin';
  } catch (error) {
    return false;
  }
}

router.beforeEach(async (to, from, next) => {
  const isLoggedIn = await isAuthenticated();

  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/auth');  // Redirect to login if not authenticated
  } else if (to.meta.requiresAdmin && isLoggedIn) {
    const isAdminUser = await isAdmin();

    if (to.meta.requiresAdmin && !isAdminUser) {
      next('/');  // Redirect to home if not an admin
    } else {
      next();  // Proceed to the admin page
    }
  } else {
    next();  // Proceed if no authentication or admin check is required
  }
});

export default router;
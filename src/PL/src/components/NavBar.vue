<template>
  <nav class="navbar">
    <div class="navbar-content">
      <!-- Logo -->
      <div class="logo">Electro Jihad</div>

      <!-- Hamburger Menu for Mobile -->
      <button class="hamburger-menu" @click="toggleMenu">
        <span :class="menuOpen ? 'open' : ''"></span>
        <span :class="menuOpen ? 'open' : ''"></span>
        <span :class="menuOpen ? 'open' : ''"></span>
      </button>

      <!-- Navigation Links -->
      <ul :class="menuOpen ? 'nav-links open' : 'nav-links'">
        <li><router-link to="/" @click="closeMenu">Home</router-link></li>
        <li v-if="isAuthenticated"><router-link to="/services" @click="closeMenu">Services</router-link></li>
        <li v-if="isAuthenticated"><router-link to="/car-dealer" @click="closeMenu">Car Dealer</router-link></li>
        <li><router-link to="/about" @click="closeMenu">About Us</router-link></li>
        <li v-if="isAuthenticated">
          <button class="footer-button" @click="logout">
            Logout
          </button>
        </li>
        <li v-else>
          <button class="footer-button" @click="goToAuthPage">
            Sign In
          </button>
        </li>
        <!-- Admin Panel Link (visible only to admin) -->
        <li v-if="isAuthenticated && isAdmin">
          <router-link to="/admin" @click="closeMenu" class="admin-button">Admin Panel</router-link>
        </li>
      </ul>
    </div>
    <Accessibility />
  </nav>
</template>

<script>
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import Accessibility from "./Accessibility.vue";

export default {
  name: "NavBar",
  components: {
    Accessibility,
  },
  setup() {
    const router = useRouter();
    const isAuthenticated = ref(false);
    const isAdmin = ref(false); // Track if the user is an admin
    const menuOpen = ref(false);

    const toggleMenu = () => {
      menuOpen.value = !menuOpen.value;
    };

    const closeMenu = () => {
      menuOpen.value = false; // Close the menu when a link is clicked
    };

    // Check authentication status and user role (admin)
    const checkAuthStatus = async () => {
      try {
        const response = await fetch("/api/auth/check", { credentials: "include" });
        if (response.ok) {
          const user = await response.json();
          isAuthenticated.value = true;
          isAdmin.value = user.role === "admin"; // Assuming the response contains the role
        } else {
          isAuthenticated.value = false;
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        isAuthenticated.value = false;
      }
    };

    const goToAuthPage = () => {
      router.push("/auth");
    };

    const logout = async () => {
      try {
        const response = await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
        });
        if (response.ok) {
          isAuthenticated.value = false;
          router.push("/");
        } else {
          console.error("Failed to logout:", await response.json());
        }
      } catch (error) {
        console.error("Error during logout:", error);
      }
    };

    onMounted(() => {
      checkAuthStatus();
    });

    return {
      goToAuthPage,
      logout,
      isAuthenticated,
      isAdmin, // Expose the isAdmin to the template
      menuOpen,
      toggleMenu,
      closeMenu,
    };
  },
};
</script>


<style scoped>
/* Navbar styles */
.navbar {
  position: fixed; /* Ensures it sticks to the top always */
  top: 0;
  left: 0;
  width: 100%; /* Makes it span the full width */
  z-index: 1000; /* Stays on top of other elements */
  background-color: rgba(126, 126, 126, 0.8); /* Same background */
  backdrop-filter: blur(10px);
  padding: 15px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto; /* Center the content */
}



.navbar:hover {
  background-color: rgba(161, 161, 161, 0.8); /* Slightly darker on hover */
}

/* Logo styles */
.logo {
  color: #353535;
  font-size: 24px;
  font-weight: bold;
  font-family: "Poppins", sans-serif; /* Modern font */
  transition: transform 0.5s ease-in-out, color 0.3s;
  
}

.logo:hover {
  transform: rotate(-5deg);
  color: #ffcc00; /* Subtle color shift on hover */
}

/* Hamburger Menu */
.hamburger-menu {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 20px;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  z-index: 1100;
  margin-right:30px;
}

.hamburger-menu span {
  background-color: #fff;
  height: 3px;
  width: 100%;
  transition: all 0.3s;
  border-radius: 5px;
}

.hamburger-menu span.open:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.hamburger-menu span.open:nth-child(2) {
  opacity: 0;
}

.hamburger-menu span.open:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

/* Navigation Links */
.nav-links {
  list-style: none;
  display: flex;
  gap: 20px;
  align-items: center;
  margin: 0;
  padding: 0;
}

.nav-links li a,
.footer-button {
  color: #f0f0f0;
  text-decoration: none;
  font-weight: 600;
  font-family: "Poppins", sans-serif;
  font-size: 1rem;
  padding: 8px 16px;
  transition: color 0.3s, transform 0.3s;
  
}

.nav-links li a:hover {
  color: #ffcc00;
  transform: scale(1.1); /* Add hover effect */
}

.footer-button:hover {
  background-color: orange;
  transform: scale(1.1); /* Maintain hover for buttons */
}

.footer-button {
  background-color: #ffcc00;
  color: black;
  border: none;
  cursor: pointer;
  border-radius: 30px;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

/* Mobile Styles */
@media (max-width: 768px) {
  .hamburger-menu {
    display: flex;
  }

  .nav-links {
    display: none;
    flex-direction: column;
    position: absolute;
    top: 60px;
    right: 20px;
    background-color: rgba(126, 126, 126, 0.9);
    width: 200px;
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .nav-links.open {
    display: flex;
  }

  .nav-links li {
    margin: 10px 0;
  }
}

@media (max-width: 480px) {
  .logo {
    font-size: 20px;
  }

  .footer-button {
    font-size: 0.9rem;
  }
}
.admin-button {
  background-color: black;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  text-decoration: none;
}

.admin-button:hover {
  background-color: #000000;
}
</style>
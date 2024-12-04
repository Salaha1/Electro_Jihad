<template>
    <div>
      <!-- Accessibility Sidebar -->
      <div id="accessibility-sidebar" class="accessibility-sidebar" :class="{'active': isSidebarOpen}">
        <div class="sidebar-content">
          <h3>Accessibility Tools</h3>
          <ul>
            <li><button @click="changeTextSize('increase')">Increase Text</button></li>
            <li><button @click="changeTextSize('decrease')">Decrease Text</button></li>
            <li><button @click="toggleGrayscale">Grayscale</button></li>
            <li><button @click="toggleHighContrast">High Contrast</button></li>
            <li><button @click="toggleNegativeContrast">Negative Contrast</button></li>
            <li><button @click="toggleLightBackground">Light Background</button></li>
            <li><button @click="toggleLinksUnderline">Links Underline</button></li>
            <li><button @click="toggleReadableFont">Readable Font</button></li>
            <li><button @click="resetSettings">Reset</button></li>
          </ul>
        </div>
      </div>
      <!-- Settings Icon (always visible) -->
      <div class="settings-icon" @click="toggleSidebar">
        <span>⚙️</span> <!-- Settings gear icon -->
      </div>
    </div>
  </template>

<script>
export default {
  data() {
    return {
      isSidebarOpen: false, // Track the state of the sidebar (open/closed)
      isGrayscale: false,
      isHighContrast: false,
      isNegativeContrast: false,
      isLightBackground: false,
      isLinksUnderlined: false,
      isReadableFont: false,
      textSize: 1, // Default size for text
    };
  },
  methods: {
    // Toggle the visibility of the sidebar
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },

    // Increase or decrease text size
    changeTextSize(action) {
      if (action === 'increase') {
        this.textSize += 0.1; // Increase text size by 10%
      } else if (action === 'decrease') {
        this.textSize -= 0.1; // Decrease text size by 10%
      }
      document.body.style.fontSize = `${this.textSize}em`; // Apply to body
    },

    // Toggle grayscale mode
    toggleGrayscale() {
      this.isGrayscale = !this.isGrayscale;
      document.body.style.filter = this.isGrayscale ? 'grayscale(100%)' : 'none';
    },

    // Toggle high contrast mode
    toggleHighContrast() {
      this.isHighContrast = !this.isHighContrast;
      document.body.style.filter = this.isHighContrast ? 'contrast(200%)' : 'none';
    },

    // Toggle negative contrast mode
    toggleNegativeContrast() {
      this.isNegativeContrast = !this.isNegativeContrast;
      document.body.style.filter = this.isNegativeContrast ? 'invert(100%)' : 'none';
    },

    // Toggle light background mode
    toggleLightBackground() {
      this.isLightBackground = !this.isLightBackground;
      document.body.style.backgroundColor = this.isLightBackground ? '#fff' : '#333';
      document.body.style.color = this.isLightBackground ? '#000' : '#fff';
    },

    // Toggle underline links
    toggleLinksUnderline() {
      this.isLinksUnderlined = !this.isLinksUnderlined;
      const links = document.querySelectorAll('a');
      links.forEach(link => {
        link.style.textDecoration = this.isLinksUnderlined ? 'underline' : 'none';
      });
    },

    // Toggle readable font
    toggleReadableFont() {
      this.isReadableFont = !this.isReadableFont;
      document.body.style.fontFamily = this.isReadableFont ? 'Arial, sans-serif' : 'initial';
    },

    // Reset all settings
    resetSettings() {
      this.isGrayscale = false;
      this.isHighContrast = false;
      this.isNegativeContrast = false;
      this.isLightBackground = false;
      this.isLinksUnderlined = false;
      this.isReadableFont = false;
      this.textSize = 1;

      // Reset all styles
      document.body.style.filter = 'none';
      document.body.style.fontSize = '1em';
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
      document.body.style.fontFamily = '';
      const links = document.querySelectorAll('a');
      links.forEach(link => {
        link.style.textDecoration = 'none';
      });
    },
  },
};
</script>

<style scoped>
/* Sidebar base styles */
.accessibility-sidebar {
  position: fixed;
  top: 20%;
  right: -450px; /* Sidebar is hidden initially */
  width: 250px;
  height: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  z-index: 9999;
  transition: right 0.3s ease; /* Sliding transition */
}

/* Sidebar active state - when open */
.accessibility-sidebar.active {
  right: 0; /* Move to the visible position */
}

/* Settings Icon (gear icon) */
.settings-icon {
  position: fixed;
  top: 20px;
  right: 20px; /* Positioned at the top right of the screen */
  background-color: rgb(25, 25, 25);
  padding: 15px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* Ensure it stays above other elements */
}
.settings-icon:hover{
  transform: translateX(-30px); /* Move 200px to the left */
  transition: transform 0.3s ease; /* Smooth transition */
}
/* Sidebar content */
.sidebar-content {
  margin-top: 40px;
}

.sidebar-content h3 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.sidebar-content ul {
  list-style-type: none;
  padding: 0;
}

.sidebar-content ul li {
  margin-bottom: 10px;
}

.sidebar-content button {
  background-color: #ffcc00;
  color: #000;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  font-size: 14px;
}

.sidebar-content button:hover {
  background-color: #ffa500;
}
</style>
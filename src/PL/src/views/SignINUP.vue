<template>
  <div class="custom-container">
    <h1>Electro Jihad</h1>
    <div v-if="showSignIn" class="form-card">
      <h2>Sign In</h2>
      <input type="email" v-model="signInData.email" placeholder="Email" />
      <input type="password" v-model="signInData.password" placeholder="Password" />
      <button type="button" @click="signIn">Sign In</button>
      <p>
        Don’t have an account? 
        <a href="#" @click.prevent="toggleForms">Sign Up</a>
      </p>
    </div>
    <div v-else class="form-card">
      <h2>Sign Up</h2>
      <input type="text" v-model="signUpData.fname" placeholder="First Name" />
      <input type="text" v-model="signUpData.lname" placeholder="Last Name" />
      <input type="tel" v-model="signUpData.phone" placeholder="Phone Number" />
      <input type="email" v-model="signUpData.email" placeholder="Email" />
      <input type="password" v-model="signUpData.password" placeholder="Password" />
      <!-- reCAPTCHA Widget -->
      <div ref="recaptchaContainer" class="g-recaptcha"></div>
      <button type="button" @click="signUp">Sign Up</button>
      <p>
        Already have an account? 
        <a href="#" @click.prevent="toggleForms">Sign In</a>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showSignIn: true,
      signInData: {
        email: "",
        password: "",
      },
      signUpData: {
        fname: "",
        lname: "",
        phone: "",
        email: "",
        password: "",
        recaptchaResponse: "",
      },
      errorMessage: "",
      recaptchaSiteKey: process.env.GOOGLE_RECAPTCHA_SECRET_KEY, // Your reCAPTCHA site key here
      recaptchaLoaded: false,  // Flag to track script load status
      recaptchaRendered: false, // Flag to track reCAPTCHA render status
    };
  },
  mounted() {
    this.loadRecaptchaScript();
  },
  methods: {
    loadRecaptchaScript() {
      const script = document.createElement("script");
      script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log("reCAPTCHA script loaded successfully.");
        this.recaptchaLoaded = true;
        this.onRecaptchaScriptLoaded();
      };
      script.onerror = () => {
        console.error("Failed to load reCAPTCHA script.");
      };
      document.head.appendChild(script);
    },
    onRecaptchaScriptLoaded() {
      if (!this.recaptchaLoaded) {
        console.error("reCAPTCHA script has not loaded.");
        return;
      }

      grecaptcha.ready(() => {
        console.log("reCAPTCHA is ready.");
        if (!this.showSignIn) {
          this.renderRecaptcha(); // Render reCAPTCHA if Sign Up form is active
        }
      });
    },
    toggleForms() {
      this.showSignIn = !this.showSignIn;
      this.recaptchaRendered = false; // Reset render status
      this.$nextTick(() => {
        console.log("Form toggled to:", this.showSignIn ? "Sign In" : "Sign Up");
        if (!this.showSignIn) {
          this.renderRecaptcha(); // Render reCAPTCHA when switching to Sign Up form
        }
      });
    },
    renderRecaptcha() {
      if (typeof grecaptcha === "undefined") {
        console.error("reCAPTCHA is not defined.");
        return;
      }

      const recaptchaElement = this.$refs.recaptchaContainer;
      if (!recaptchaElement) {
        console.error("reCAPTCHA element not found.");
        return;
      }

      // Ensure that reCAPTCHA is only rendered once
      if (this.recaptchaRendered) {
        console.log("reCAPTCHA is already rendered.");
        return;
      }

      // Render the reCAPTCHA widget
      try {
        grecaptcha.render(recaptchaElement, {
          sitekey: this.recaptchaSiteKey,
          callback: this.onRecaptchaVerified,
        });
        this.recaptchaRendered = true;
        console.log("reCAPTCHA widget rendered successfully.");
      } catch (error) {
        console.error("Error rendering reCAPTCHA:", error);
      }
    },
    onRecaptchaVerified(response) {
      this.signUpData.recaptchaResponse = response;
      console.log("reCAPTCHA verified with response:", response);
    },
    async signUp() {
      if (!this.signUpData.recaptchaResponse) {
        alert("Please verify that you are not a robot.");
        return;
      }

      try {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.signUpData),
        });

        if (response.ok) {
          
          this.$router.push('/auth');  
          this.toggleForms(); // Switch to Sign In form after successful signup
        } else {
          const error = await response.json();
          console.log('Error response:', error); // Log the full error response
          alert(`Sign-up failed: ${error.error || error.message || 'Unknown error'}`); // Use the correct property based on the response
        }
      } catch (err) {
        console.error('Sign-up error:', err);
        alert('An error occurred during sign-up.');
      }
    },

    async signIn() {
      try {
        const response = await fetch('/api/auth/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.signInData),
        });

        if (response.ok) {
          const data = await response.json();
         
          this.$router.push('/');  // Home page route
        } else {
          const error = await response.json();
          console.log('Error response:', error);
          alert(`Sign-in failed: ${error.error || error.message || 'Unknown error'}`);
        }
      } catch (err) {
        console.error('Sign-in error:', err);
        alert('An error occurred during sign-in.');
      }
    },
  },
};
</script>

<style scoped>
/* Center and style the container */
.custom-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: black;
  color: #e6b800;
  font-family: Arial, sans-serif;
}

/* Style the title */
h1 {
  margin-bottom: 20px;
  font-size: 2rem;
  color: #e6b800;
  text-transform: uppercase;
}

/* Style the form card */
.form-card {
  background-color: #1a1a1a;
  padding: 30px;
  border: 2px solid #e6b800;
  border-radius: 10px;
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.form-card h2 {
  margin-bottom: 20px;
  color: #e6b800;
}

/* Style the inputs */
input {
  display: block;
  width: calc(100% - 20px);
  margin: 10px auto;
  padding: 10px;
  border: 1px solid #e6b800;
  border-radius: 5px;
  background-color: #333;
  color: white;
}

input::placeholder {
  color: #aaa;
}

/* Style the buttons */
button {
  background-color: #e6b800;
  color: black;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  width: 100%;
  max-width: 400px;
}

button:hover {
  background-color: orange;
}


/* Links style */
a {
  color: #ffdc18;
  text-decoration: none;
}

a:hover {
  color: orange;
}
</style>
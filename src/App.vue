<template>
  <v-app>
    <v-app-bar app>
      <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>
      <v-toolbar-title>
        <!-- <v-img src="./assets/logo.png"></v-img> -->
        Ilove Formatter
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="toggleTheme">
        <v-icon>{{ isDarkTheme ? 'mdi-brightness-4' : 'mdi-brightness-7' }}</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-export</v-icon>
      </v-btn>
      <v-btn v-if="!isAppInstalled && !deferredPrompt" @click="promptInstall">I
      </v-btn>
      <v-btn v-if="updateAvailable" @click="updateApp">U
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-navigation-drawer v-model="drawer" app permanent>
        <v-list>
          <v-list-item :class="{color: selectedNavItem ==='JSON Format' ? 'red' : 'red'}">
            <v-list-item-title @click="navItem('JSON Format')">JSON Format</v-list-item-title>
          </v-list-item>
          <v-divider ></v-divider>
          <v-list-item>
            <v-list-item-title @click="navItem('diff check')">Diff Checker</v-list-item-title>
          </v-list-item>
          <v-divider ></v-divider>
        </v-list>
      </v-navigation-drawer>
      <v-container>
        <v-responsive class="rounded">
          <HelloWorld v-if="selectedNavItem ==='JSON Format'" />
          <DiffCheck v-if="selectedNavItem ==='diff check'" />
        </v-responsive>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import DiffCheck from './components/DiffCheck.vue';
export default {
  name: 'App',
  components: {
    HelloWorld,
    DiffCheck
  },
  data() {
    return {
      isDarkTheme: true,
      drawer: false, // State for the navigation drawer
      selectedNavItem:'JSON Format',
      isAppInstalled: false,
      updateAvailable: false,
      deferredPrompt: null, // Store deferred install prompt
      inject: ['deferredPrompt'], // Inject the deferredPrompt
    }
  },
  computed: {
    currentTheme() {
      return this.isDarkTheme ? 'dark' : 'light'
    },
  },
  methods: {
    toggleTheme() {
      this.isDarkTheme = !this.isDarkTheme
      this.$vuetify.theme.global.name = this.currentTheme
    },
    toggleDrawer() {
      this.drawer = !this.drawer // Toggle the drawer's visibility
    },
    navItem(itemWas){
      this.selectedNavItem = itemWas
    },

    // PWA
    promptInstall() {
      if (this.deferredPrompt) {
        this.deferredPrompt.prompt();
        this.deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the installation prompt');
          } else {
            console.log('User dismissed the installation prompt');
          }
          this.deferredPrompt = null; // Reset after use
        });
      }
    },
    updateApp() {
      if (navigator.serviceWorker) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          registrations.forEach((registration) => {
            registration.update();
          });
        });
      }
    },
  },
  mounted() {
    // Check if the app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.isAppInstalled = true;
    }

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (event) => {
      // Prevent the default prompt
      event.preventDefault();
      this.deferredPrompt = event;
    });

    // Check for app updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener('updatefound', () => {
          this.updateAvailable = true;
        });
      });
    }
  },
}
</script>

<style>
.border {
  border: 1px solid #e0e0e0;
}

.rounded {
  border-radius: 4px;
}
</style>

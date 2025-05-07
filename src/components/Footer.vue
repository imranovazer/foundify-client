<script lang="ts" setup></script>

<template>
  <footer class="bg-gray-900 text-gray-300">
    <div class="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Logo & Description -->
        <div>
          <h3 class="text-white text-xl font-bold mb-2">YourBrand</h3>
          <p class="text-sm">
            Creating great experiences for web and mobile users. Powered by modern technology.
          </p>
        </div>

        <!-- Navigation -->
        <div>
          <h4 class="text-white font-semibold mb-3">Company</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="#" class="hover:underline">About</a></li>
            <li><a href="#" class="hover:underline">Careers</a></li>
            <li><a href="#" class="hover:underline">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 class="text-white font-semibold mb-3">Resources</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="#" class="hover:underline">Blog</a></li>
            <li><a href="#" class="hover:underline">Docs</a></li>
            <li><a href="#" class="hover:underline">Support</a></li>
          </ul>
        </div>

        <!-- Social Media -->
        <div>
          <h4 class="text-white font-semibold mb-3">Follow Us</h4>
          <div class="flex space-x-4">
            <a href="#" aria-label="Twitter" class="hover:text-white">
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0016 2a4.48 
              4.48 0 00-4.21 5.52A12.94 12.94 0 013 4s-4 9 5 13a13.38 
              13.38 0 01-8 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 
              7.72 0 0023 3z"
                />
              </svg>
            </a>
            <a href="#" aria-label="Facebook" class="hover:text-white">
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 
              1 0 011-1h3z"
                />
              </svg>
            </a>
            <a href="#" aria-label="GitHub" class="hover:text-white">
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 1C5.925 1 1 5.925 1 12a11 
              11 0 007.538 10.477c.55.102.75-.238.75-.53 0-.262-.01-1.14-.015-2.065-3.066.666-3.712-1.48-3.712-1.48-.5-1.25-1.22-1.58-1.22-1.58-1-.68.08-.666.08-.666 
              1.11.08 1.694 1.14 1.694 1.14.98 1.68 2.58 1.2 3.21.92.098-.71.38-1.2.69-1.48-2.45-.28-5.03-1.225-5.03-5.455 
              0-1.2.43-2.18 1.14-2.95-.11-.28-.5-1.44.11-3 0 0 .94-.3 
              3.08 1.14a10.67 10.67 0 015.6 0c2.14-1.44 3.08-1.14 
              3.08-1.14.61 1.56.22 2.72.11 3 .71.77 1.14 1.75 
              1.14 2.95 0 4.24-2.58 5.17-5.04 5.45.39.34.75 
              1.01.75 2.05 0 1.48-.015 2.67-.015 3.03 0 
              .29.19.64.76.53A11.004 11.004 0 0023 12c0-6.075-4.925-11-11-11z"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div class="mt-10 text-center text-sm text-gray-500 border-t border-gray-700 pt-4">
        &copy; 2025 YourBrand. All rights reserved.
      </div>
    </div>
  </footer>
</template>

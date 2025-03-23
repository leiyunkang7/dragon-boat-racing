<template>
  <div class="min-h-screen bg-gray-100">
    <NuxtPage />
  </div>
</template>

<style>
html {
  @apply antialiased;
}

body {
  @apply m-0 p-0 font-sans;
}

h1, h2, h3, h4, h5, h6 {
  @apply m-0 text-gray-800;
}

button {
  @apply cursor-pointer border-none outline-none font-sans;
}

.container {
  @apply max-w-[600px] mx-auto p-5;
}
</style>

<template>
  <div class="container">
    <h1 class="title">端午节活动</h1>
    <div class="menu">
      <NuxtLink to="/quiz" class="menu-item">
        <div class="menu-content">
          <h2>答题领券</h2>
          <p>参与答题赢取端午节礼品券</p>
        </div>
      </NuxtLink>
      <NuxtLink to="/game" class="menu-item">
        <div class="menu-content">
          <h2>划龙舟</h2>
          <p>来一场刺激的龙舟竞速</p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
// 页面逻辑
</script>

<style scoped>
.container {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.title {
  text-align: center;
  color: #d4380d;
  margin-bottom: 40px;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.menu-item {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.menu-item:hover {
  transform: translateY(-2px);
}

.menu-content {
  text-align: center;
}

.menu-content h2 {
  color: #d4380d;
  margin-bottom: 8px;
}

.menu-content p {
  color: #666;
  margin: 0;
}
</style> 
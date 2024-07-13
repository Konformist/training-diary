<template>
  <div class="fullscreen bg-dark text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">
        404
      </div>
      <div class="text-h4" style="opacity:.4">
        Страница не реализована
      </div>
      <q-btn
        class="q-mt-xl"
        label="Назад"
        color="primary"
        unelevated
        to="/"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'ErrorNotFound',
});
</script>

<template>
  <div :title="date" v-if="date">
    {{ prefix }} {{ date | formatDate }} {{ postfix }}
  </div>
</template>

<script>
export default {
  props: ['date', 'prefix', 'postfix']
}
</script>

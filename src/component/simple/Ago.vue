<template>
  <div :title="date" v-if="date">
    {{ date | formatDate }}
  </div>
</template>

<script>
export default {
  props: ['date']
}
</script>

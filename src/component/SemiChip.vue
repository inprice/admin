<template>
  <div :class="{ 'caption': dense }" class="d-flex whole">
    <div :style="{ color: fgColor, backgroundColor: bgColor, 'width' : '100%' }" class="px-2 tag-section my-auto">
      {{ tag }}
    </div>
    <div v-if="value" :style="{ color: fgColor || bgColor }" class="value-section mx-auto px-2 my-auto">
      {{ value }}
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'semi-chip',
  props: {
    dense: {
      type: Boolean,
      default: false
    },
    tag: {
      type: String
    },
    value: {
      type: String
    },
    fgColor: {
      type: String
    },
    tagColor: {
      type: String,
      default: 'white'
    },
    bgColor: {
      type: String,
      default: 'teal'
    }
  }
}
</script>

<style scoped>
  .whole {
    border: 1px #ccc solid; 
    border-radius: 3px;
  }
  .tag-section {
    font-weight: 500;
    border-right: 1px #ccc solid; 
    border-radius: 0 3p 3px 0;
  }
  .value-section {
    background-color: white;
  }
</style>

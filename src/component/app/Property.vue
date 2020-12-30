<template>
  <tr>
    <td class="prop-name">{{ name }}</td>
    <td>
      <v-card elevation="1" class="prop-value" :class="valueClass" v-if="value">
        {{ value }}
      </v-card>
      <slot></slot>
    </td>
  </tr>
</template>

<script>
export default {
  props: {
    name: {
      type: String
    },
    value: { },
    valueClass: {
      default: 'col'
    },
  }

}
</script>

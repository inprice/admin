<template>
  <tr>
    <td class="prop-name">{{ name }}</td>
    <td>
      <v-card elevation="1" class="prop-value" :class="valueClass">
        <slot v-if="$slots !== {}"></slot>
        {{ value || ' ' }}
      </v-card>
    </td>
  </tr>
</template>

<script>
//TODO: must be deleted!!!

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

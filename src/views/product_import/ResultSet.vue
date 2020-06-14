<template>
  <div>

    <p class="subtitle">
      The result set of uploaded {{ title }}
    </p>

    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th>No</th>
            <th>Name</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in data" :key="index">
            <td class="text-right">{{ index+1 }}.</td>
            <td width="70%">{{ row.line }}</td>
            <td>{{ row.result }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
export default {
  props: ['data', 'title']
}
</script>

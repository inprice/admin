<template>
  <div class="mt-5">
    <v-card>
      <v-card-title>
        <v-icon class="mr-4">mdi-bookmark-multiple-outline</v-icon>
        <div>
          <div>Actual Plan</div>
          <div class="caption">The details of your current plan.</div>
        </div>

        <v-spacer></v-spacer>

        <v-btn small color="error" @click="cancel" v-if="status == 'ACTIVE' || status == 'COUPONED'">Cancel</v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-row v-if="status == 'ACTIVE' || status == 'COUPONED'">

        <v-col>
          <v-list two-line>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Name</v-list-item-title>
                <v-list-item-subtitle>{{ data.name }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Description</v-list-item-title>
                <v-list-item-subtitle>{{ data.description }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>

        <v-col>
          <v-list two-line>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Status</v-list-item-title>
                <v-list-item-subtitle>{{ data.status }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Renewal Date</v-list-item-title>
                <v-list-item-subtitle>{{ data.renewalTime }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>

      </v-row>

      <div v-else>
        <v-divider></v-divider>
        <div class="pa-4">You have <strong>no actual plan</strong> at the moment. You can either subscribe or use a coupon.</div>
      </div>

    </v-card>
  </div>

</template>

<script>
export default {
  props: ['data', 'status'],
  methods: {
    cancel() {
      this.$emit('cancel');
    }
  },
};
</script>

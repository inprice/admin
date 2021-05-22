<template>
  <v-row justify="center">

    <v-dialog 
      v-model="opened" 
       :max-width="findDialogWidth"
       overlay-opacity="0.2">
      <v-card>
        <div class="pa-3 d-flex justify-space-between">
          <span class="pl-2 my-auto">
            For a better service, please assess your experience
          </span>
          <v-btn icon @click="close"><v-icon>mdi-close</v-icon></v-btn>
        </div>

        <v-divider></v-divider>

        <v-divider class="mb-3"></v-divider>

        <v-card-text class="pb-2">

          <v-form ref="form" v-model="valid" @submit.prevent>
            <input type="hidden" :value="form.id" >

            <v-select
              dense
              outlined
              label="Level"
              v-model="form.level"
              :items="levelItems"
            ></v-select>

            <v-textarea
              autofocus
              counter
              outlined
              v-model="form.assessment"
              label="Your assessment"
              rows="4"
              :rules="rules.assessment"
            ></v-textarea>

          </v-form>

        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="py-4 justify-end">
          <v-btn
            text outlined
            tabindex="-1"
            @click="close"
          >
            Close
          </v-btn>
          <v-btn
            text outlined
            color="success"
            @click="save"
            :disabled="$store.get('session/isSuperUser')"
          >
            Save
          </v-btn>

        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>

const levelItems = [ 'HIGH', 'GOOD', 'ENOUGH', 'NEUTRAL', 'BAD' ];

export default {
  computed: {
    findDialogWidth() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return '80%';
        case 'sm': return '50%';
        case 'md': return '35%';
        case 'lg': return '27%';
        default: return '18%';
      }
    },
  },
  data() {
    return {
      opened: false,
      valid: false,
      rules: {},
      form: {
        id: null,
        level: levelItems[0],
        assessment: null,
      },
      levelItems,
    };
  },
  methods: {
    open(form) {
      this.form = form;
      this.opened = true;
      this.$nextTick(() => this.$refs.form.resetValidation());
    },
    async save() {
      this.activateRules();
      await this.$refs.form.validate();
      if (this.valid) {
        this.$emit('saved', this.form);
        this.close();
      }
    },
    close() {
      this.opened = false;
      this.rules = {};
    },
    activateRules() {
      this.rules = {
        assessment: [
          v => {
            const assessmentRequired = (this.form.level != 'HIGH' && this.form.level != 'GOOD');
            if (!v && assessmentRequired) {
              return this.form.level + ' level requires your assessment!';
            }
            if (v && (v.length < 12 || v.length > 512)) {
              return (assessmentRequired ? 'Your ' : 'If given, ') + 'assessment must be between 12-512 chars';
            }
            return true;
          }
        ],
      }
    },
  },
};
</script>

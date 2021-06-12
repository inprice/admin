<template>
  <v-row justify="center">

    <v-dialog 
      v-model="opened" 
      max-width="40%"
      overlay-opacity="0.2"
    >
      <v-card>
        <v-card-title class="pr-3 justify-space-between">
          <span>{{ form.id ? 'Edit' : 'New' }} Announce</span>
          <v-btn icon @click="close"><v-icon>mdi-close</v-icon></v-btn>
        </v-card-title>

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

            <div class="d-flex">
              <v-text-field
                dense
                outlined
                v-mask="'####-##-## ##:##'"
                v-model="form.startingAt"
                :rules="rules.startingAt"
                label="Starting At"
                class="pr-2"
              ></v-text-field>

              <v-text-field
                dense
                outlined
                v-mask="'####-##-## ##:##'"
                v-model="form.endingAt"
                :rules="rules.endingAt"
                label="Ending At"
                class="pl-2"
              ></v-text-field>
            </div>

            <v-text-field
              autofocus
              dense
              outlined
              label="Title"
              v-model="form.title"
              :rules="rules.title"
            ></v-text-field>

            <v-textarea
              counter
              outlined
              v-model="form.body"
              :rules="rules.body"
              label="Body"
              rows="8"
              maxlength="1024"
            ></v-textarea>

          </v-form>

        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="py-4 justify-end">
          <v-btn
            text
            tabindex="-1"
            @click="close"
          >
            Close
          </v-btn>
          <v-btn
            text
            color="success"
            @click="save"
          >
            Save
          </v-btn>

        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import moment from 'moment';

const dtf = 'YYYY-MM-DD HH:mm';
const levelItems = ['INFO', 'WARNING'];

export default {
  data() {
    return {
      opened: false,
      valid: false,
      rules: {},
      form: {
        id: null,
        level: levelItems[0],
        startingAt: null,
        endingAt: null,
        title: null,
        body: null,
        account: null,
      },
      startingAtMenuOpen: false,
      endingAtMenuOpen: false,
      levelItems,
    };
  },
  methods: {
    open(data) {
      this.form.id = null;
      this.form.level = levelItems[0];
      this.form.startingAt = moment().format(dtf);
      this.form.endingAt = moment().add(1, 'M').format(dtf);
      this.form.title = null;
      this.form.body = null;
      if (data) {
        this.form.id = data.id;
        this.form.level = data.level;
        this.form.startingAt = data.startingAt;
        this.form.endingAt = data.endingAt;
        this.form.title = data.title;
        this.form.body = data.body;
      }
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
        startingAt: [
          v => !!v || "Required",
          v => moment(v, dtf).isValid() || "Must be a valid date",
        ],
        endingAt: [
          v => !!v || "Required",
          v => moment(v, dtf).isValid() || "Must be a valid date",
        ],
        title: [
          v => !!v || "Required",
          v => (v && v.length >= 5 && v.length <= 50) || "Must be between 5-50 chars"
        ],
        body: [
          v => !!v || "Required",
          v => (v && v.length >= 12 && v.length <= 1024) || "Must be between 12-1024 chars"
        ],
      }
    },
  },
};
</script>

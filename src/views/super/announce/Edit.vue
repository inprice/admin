<template>
  <v-dialog 
    v-model="show"
    overlay-opacity="0.3"
    content-class="rounded-dialog"
  >
    <v-card>
      <v-card-title class="pb-0 d-flex justify-space-between">
        <div>
          <div>{{ form.id ? 'Edit' : 'New' }} Announce</div>
          <div class="caption">For {{ forWhom }}</div>
        </div>
        <v-btn icon @click="show = false"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>

      <v-card-text class="py-0 mt-3">
        <v-form ref="form" v-model="valid" @submit.prevent>
          <input type="hidden" :value="form.id">

          <v-select
            dense
            outlined
            label="Position"
            v-model="form.position"
            :items="positionItems"
          ></v-select>

          <div class="d-flex">
            <v-text-field
              dense
              outlined
              v-mask="'####-##-## ##:##'"
              v-model="form.startingAt"
              :rules="rules.startingAt"
              label="Starting At"
              class="pr-1"
            ></v-text-field>

            <v-text-field
              dense
              outlined
              v-mask="'####-##-## ##:##'"
              v-model="form.endingAt"
              :rules="rules.endingAt"
              label="Ending At"
              class="pl-1"
            ></v-text-field>
          </div>

          <v-text-field
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

      <v-card-actions class="justify-end pa-3">
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
</template>

<script>
import moment from 'moment';

const dtf = 'YYYY-MM-DD HH:mm';
const levelItems = ['INFO', 'WARNING'];

export default {
  data() {
    return {
      show: false,
      valid: false,
      rules: {},
      form: {
        id: null,
        level: levelItems[0],
        startingAt: null,
        endingAt: null,
        title: null,
        body: null,
        workspace: null,
      },
      forWhom: 'public',
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
      this.form.userId = null;
      this.form.workspaceId = null;
      if (data) {
        this.form.id = data.id;
        this.form.title = data.title;
        this.form.body = data.body;
        this.form.userId = data.userId;
        this.form.workspaceId = data.workspaceId;
        if (data.level) this.form.level = data.level;
        if (data.startingAt) this.form.startingAt = data.startingAt;
        if (data.endingAt) this.form.endingAt = data.endingAt;
        if (data.forWhom) this.forWhom = data.forWhom;
      }
      this.show = true;
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
      this.show = false;
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

<template>
  <v-dialog 
    v-model="show"
    overlay-opacity="0.3"
    content-class="rounded-dialog"
  >
    <v-card>
      <v-card-title class="pb-0 d-flex justify-space-between">
        <span>{{ form.id ? 'Edit' : 'New' }} Ticket</span>
        <v-btn icon @click="close"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>

      <v-card-text class="py-0 mt-3">
        <v-form ref="form" v-model="valid" @submit.prevent>
          <input type="hidden" :value="form.id">

          <v-select
            dense
            outlined
            label="You want to"
            v-model="form.type"
            :items="typeItems"
            item-text="secondary"
            item-value="value"
          >
            <template v-slot:selection="{ item }">
              {{ item.secondary }}
            </template>    
          </v-select>

          <v-select
            dense
            outlined
            label="Priority"
            v-model="form.priority"
            :items="priorityItems"
            item-text="text"
            item-value="value"
          ></v-select>

          <v-select
            dense
            outlined
            label="About"
            v-model="form.subject"
            :items="subjectItems"
            item-text="text"
            item-value="value"
          ></v-select>

          <v-textarea
            counter
            outlined
            v-model="form.body"
            :rules="rules.body"
            label="Issue"
            rows="8"
            maxlength="512"
          ></v-textarea>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="justify-end pa-3">
        <v-btn
          text
          color="success"
          @click="save"
          :disabled="form.status != 'OPENED' || $store.get('session/isSuperUser')"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import SystemData from '@/data/system';

export default {
  data() {
    return {
      show: false,
      valid: false,
      rules: {},
      form: {
        id: null,
        type: null,
        subject: null,
        priority: null,
        body: null,
      },
      typeItems: SystemData.TICKET_TYPES,
      priorityItems: SystemData.TICKET_PRIORITIES,
      subjectItems: SystemData.TICKET_SUBJECTS,
    };
  },
  methods: {
    open(data) {
      this.form.status = 'OPENED';
      this.form.id = null;
      this.form.type = SystemData.TICKET_TYPES[0].value;
      this.form.subject = SystemData.TICKET_SUBJECTS[0].value;
      this.form.priority = SystemData.TICKET_PRIORITIES[0].value;
      this.form.body = null;
      if (data) {
        this.form.status = data.status;
        this.form.id = data.id;
        this.form.type = data.type;
        this.form.subject = data.subject;
        this.form.priority = data.priority;
        this.form.body = data.body;
      }
      this.show = true;
      this.$nextTick(() => this.$refs.form.resetValidation());
    },
    async save() {
      this.activateRules();
      await this.$refs.form.validate();
      if (this.valid) {
        if (typeof this.form.type === 'object') {
          const tType = this.form.type.value;
          this.form.type = tType;
        }
        this.$emit('saved', this.form);
      }
    },
    close() {
      this.show = false;
      this.rules = {};
    },
    activateRules() {
      this.rules = {
        body: [
          v => !!v || "Required",
          v => (v && v.length >= 12 && v.length <= 1024) || "Must be between 12-1024 chars"
        ],
      }
    },
  },
};
</script>

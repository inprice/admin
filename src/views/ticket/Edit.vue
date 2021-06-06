<template>
  <v-row justify="center">

    <v-dialog 
      v-model="opened" 
       :max-width="findDialogWidth"
       overlay-opacity="0.2">
      <v-card>
        <v-card-title class="pr-3 justify-space-between">
          <span>{{ form.id ? 'Edit' : 'New' }} Ticket</span>
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
              label="You want to"
              v-model="form.type"
              :items="typeItems"
              item-text="text"
              item-value="value"
            >
              <template v-slot:selection="{ item }">
                {{ item.text }}
              </template>    
            </v-select>

            <v-select
              dense
              outlined
              label="Priority"
              v-model="form.priority"
              :items="priorityItems"
            ></v-select>

            <v-select
              dense
              outlined
              label="About"
              v-model="form.subject"
              :items="subjectItems"
            ></v-select>

            <v-textarea
              autofocus
              counter
              outlined
              v-model="form.body"
              label="Issue"
              rows="8"
              maxlength="512"
              :rules="rules.body"
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
            :disabled="form.status != 'OPENED' || $store.get('session/isSuperUser')"
          >
            Save
          </v-btn>

        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>

const typeItems = [ 
  { value: 'PROBLEM', text: 'Report a problem' },
  { value: 'SUPPORT', text: 'Ask support' },
  { value: 'FEEDBACK', text: 'Give feedback' },
];

const priorityItems = ['LOW', 'NORMAL', 'HIGH', 'CRITICAL'];
const subjectItems = [ 'SUBSCRIPTION', 'PAYMENT', 'LINK', 'GROUP', 'ACCOUNT', 'COUPON', 'OTHER' ];

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
        type: typeItems[0],
        priority: priorityItems[0],
        subject: subjectItems[0],
        body: null,
      },
      typeItems,
      priorityItems,
      subjectItems,
    };
  },
  methods: {
    open(data) {
      this.form.status = 'OPENED';
      this.form.id = null;
      this.form.type = typeItems[0];
      this.form.subject = subjectItems[0];
      this.form.priority = priorityItems[0];
      this.form.body = null;
      if (data) {
        this.form.status = data.status;
        this.form.id = data.id;
        this.form.type = data.type;
        this.form.subject = data.subject;
        this.form.priority = data.priority;
        this.form.body = data.body;
      }
      this.opened = true;
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
        this.close();
      }
    },
    close() {
      this.opened = false;
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

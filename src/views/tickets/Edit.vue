<template>
  <v-row justify="center">

    <v-dialog 
      v-model="opened" 
       :max-width="findDialogWidth"
       overlay-opacity="0.2">
      <v-card>
        <v-card-title class="pr-3">
          {{ form.id ? 'Edit' : 'New' }} Ticket
          <v-spacer></v-spacer>
          <v-btn icon @click="close"><v-icon>mdi-close</v-icon></v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-divider class="mb-3"></v-divider>

        <v-card-text>

          <v-form ref="form" v-model="valid">
            <input type="hidden" :value="form.id" >

            <v-select
              autofocus
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
              label="About"
              v-model="form.subject"
              :items="subjectItems"
            ></v-select>

            <v-textarea
              counter
              outlined
              v-model="form.query"
              label="Thought"
              rows="8"
              :rules="rules.query"
            ></v-textarea>

          </v-form>

        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="py-4 justify-end">
          <v-btn tabindex="-1" small @click="close">Close</v-btn>
          <v-btn
            small
            @click="save"
            color="success"
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
const subjectItems = [ 'SUBSCRIPTION', 'PAYMENT', 'LINK', 'GROUP', 'ACCOUNT', 'COUPON', 'OTHER' ];

export default {
  computed: {
    findDialogWidth() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return '80%';
        case 'sm': return '50%';
        case 'md': return '35%';
        case 'lg': return '27%';
        default: return '16%';
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
        subject: subjectItems[0],
        query: null,
      },
      typeItems,
      subjectItems,
    };
  },
  methods: {
    open(data) {
      this.form.id = null;
      this.form.type = typeItems[0];
      this.form.subject = subjectItems[0];
      this.form.query = null;
      if (data) {
        this.form.id = data.id;
        this.form.type = data.type;
        this.form.subject = data.subject;
        this.form.query = data.query;
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
        query: [
          v => !!v || "Required",
          v => (v && v.length >= 12 && v.length <= 512) || "Name must be between 12-512 chars"
        ],
      }
    },
  },
};
</script>

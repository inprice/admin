<template>
  <v-row justify="center">

    <v-dialog  v-model="opened" :max-width="findDialogWidth" overlay-opacity="0.2">

      <v-card>

        <v-card-title>
          <div>
            <div class="caption">{{ this.groupName }}</div>
            Add New Links
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="close"><v-icon>mdi-close</v-icon></v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-form ref="form" v-model="valid">
          <v-textarea
            autofocus
            outlined
            v-model="form.linksText"
            :label="getTextareaLabel"
            class="pa-4 pb-0"
            rows="5"
            :rules="rules.linksText"
            @keyup="checkRowLimit"
          ></v-textarea>
        </v-form>

        <v-divider></v-divider>

        <v-card-actions class="py-4">
          <v-icon class="mr-2">mdi-alert-circle-outline</v-icon>
          <span class="font-weight-light">One url per row!</span>
          <v-spacer></v-spacer>
          <v-btn
            @click="save"
            color="primary"
            :loading="loading" 
            :disabled="loading"
          >
            Save
          </v-btn>

        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import GroupService from '@/service/group';
import Utility from '@/helpers/utility';
import { get } from 'vuex-pathify';

export default {
  props: ["groupId", "groupName"],
  computed: {
    CURSTAT: get('session/getCurrentStatus'),
    getTextareaLabel() {
      return (this.rowLimit-this.lines) +' links can be added';
    },
    findDialogWidth() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return '90%';
        default: return '50%';
      }
    },
  },
  data() {
    const CURSTAT = get('session/getCurrentStatus');
    return {
      lines: 0,
      rowLimit: (CURSTAT.remainingLinkCount <= 100 ? CURSTAT.remainingLinkCount : 25),
      opened: false,
      loading: false,
      valid: false,
      rules: {},
      form: {
        linksText: '',
      },
      textareaLabel: '',
    };
  },
  methods: {
    open() {
      this.opened = true;

      let self = this;
      this.$nextTick(() => {
        self.$refs.form.resetValidation();
      });
    },
    async save() {
      this.activateRules();
      await this.$refs.form.validate();
      if (this.valid) {
        this.loading = true;

        const data = await GroupService.insertLinks(this.groupId, this.form.linksText);
        if (data) {
          this.$emit("added", data);
          this.close();
        }
        this.loading = false;
      }
    },
    close() {
      this.opened = false;
      this.loading = false;
      this.rules = {};
      this.$refs.form.reset();
    },
    activateRules() {
      this.rules = {
        linksText: [
          v => !!v || "Required",
          v => (v && v.length > 15) || "Url must be at least 16 chars",
          v => {
            const urls = v.split("\n");
            let problems = [];
            for (var i=0; i < urls.length; i++) {
              if (urls[i] && ! Utility.verifyURL(urls[i])) problems.push(i+1);
            }
            if (problems.length > 0) {
              return 'There are invalid URLs. Please check the rows at [ ' + problems + ' ]';
            }
            return true;
          }
        ],
      }
    },
    checkRowLimit(e) {
      this.lines = 0;
      if (this.form && this.form.linksText) {
        const newLines = this.form.linksText.split("\n").length;
        this.lines = newLines;
        if(e.keyCode == 13) {
          if (this.CURSTAT.remainingLinkCount && newLines >= this.CURSTAT.remainingLinkCount)
          e.preventDefault();
          return false;
        }
      }
    }
  },
};
</script>

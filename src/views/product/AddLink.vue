<template>
  <v-dialog
    v-model="show"
    overlay-opacity="0.3"
    content-class="rounded-dialog"
    :max-width="1000"
  >
    <v-card>
      <v-card-title class="pb-0 d-flex justify-space-between">
        <div>
          Add New Links
          <div class="caption">For {{ this.productName }}</div>
        </div>
        <v-btn icon @click="close"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>

      <v-card-text class="py-0 mt-3">
        <v-form ref="form" v-model="valid" @submit.prevent>
          <v-textarea
            outlined
            v-model="form.linksText"
            :label="`${SystemConsts.LIMITS.LINK_ADDING - lines} links can be added.`"
            rows="5"
            :rules="rules.linksText"
            @keyup="checkRowLimit"
          ></v-textarea>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-3 justify-space-between">
        <div class="body-2 ml-2">
          <v-icon color="green" class="mx-1" >mdi-shield-alert-outline</v-icon>
          One url per row!
        </div>

        <v-btn
          text
          color="primary"
          @click="save"
          :loading="loading" 
          :disabled="loading || $store.get('session/isNotEditor')"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Utility from '@/helpers/utility';
import SystemService from '@/service/system';
import SystemConsts from '@/data/system';

export default {
  props: ["productId", "productName"],
  data() {
    return {
      lines: 0,
      show: false,
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
      this.form.linksText = '';
      SystemService.getStatistics().then((res) => {
        if (res && res.status) {
          const result = res.data;
          if (result.remainingLink) {
            this.show = true;

            let self = this;
            this.$nextTick(() => {
              self.$refs.form.resetValidation();
            });
            this.$store.commit('session/SET_PRODUCT_COUNT', result.productCount);
          } else {
            this.$store.commit('snackbar/setMessage', 
              { 
                text: 'You have reached the limit of your plan. Please consider to subscribe a broader plan!', 
                centered: true, 
                closeButton: false, 
                timeout: 2000 
              }
            );
          }
        }
      });
    },
    async save() {
      if (this.lines <= SystemConsts.LIMITS.LINK_ADDING) {
        this.activateRules();
        await this.$refs.form.validate();
        if (this.valid) {
          this.lines = 0;
          this.$emit("added", this.form.linksText);
          this.close();
        }
      } else {
        this.$store.commit('snackbar/setMessage', { text: 'You can add up to ' + SystemConsts.LIMITS.LINK_ADDING + ' links.' });
      }
    },
    close() {
      this.show = false;
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
          if (newLines >= SystemConsts.LIMITS.LINK_ADDING)
          e.preventDefault();
          return false;
        }
      }
    }
  },
};
</script>

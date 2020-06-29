<template>
  <div class="d-flex flex-row">
    <v-select 
      dense
      :items="items"
      v-model="valueModel">

      <template v-slot:label>
        <div>
          {{ label }}
        </div>
      </template>
    </v-select>

    <div class="pt-2" v-if="$store.get('auth/IS_EDITOR')">
      <v-menu
        v-model="opened"
        :close-on-content-click="false"
        :nudge-width="250"
        offset-y
        left
      >
        <template v-slot:activator="{ on, attrs }">
          <v-icon v-on="on" v-bind="attrs">mdi-plus</v-icon>
        </template>

        <v-card>
          <v-form ref="form" v-model="valid">
            <v-text-field
              autofocus
              v-model="newValue"
              :label="textLabel"
              :rules="rules.newValue"
              type="text"
              maxlength="50"
              class="mx-5 pt-4"
            />
          </v-form>

          <v-card-actions class="pt-0">
            <v-spacer></v-spacer>
            <v-btn text @click="opened=false" small>Cancel</v-btn>
            <v-btn color="primary" text @click="save" small>Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </div>
  </div>
</template>

<script>
import ApiService from '@/service/api';
import LookupService from '@/service/lookup';

export default {
  props: ['value', 'type', 'label'],
  watch: {
    opened() {
      this.rules = {};
      this.newValue = '';
      if (this.textLabel == '') this.textLabel = 'New ' + this.type.toLowerCase();
    }
  },
  computed: {
    valueModel: {
      get: function(){
        return this.value;
      },
      set: function(newValue){
        this.$emit('update:value', newValue)
      }   
    }
  },
  data() {
    return {
      opened: false,
      loading: false,
      valid: false,
      newValue: '',
      textLabel: '',
      items: [],
      rules: {},
    }
  },
  methods: {
    async save() {
      if (Object.keys(this.rules).length == 0) this.activateRules();
      await this.$refs.form.validate();
      if (this.valid) {
        this.loading = true;
        const result = await LookupService.add({ type: this.type, newValue: this.newValue });
        if (result.status == true) {
          this.items = result.data.items;
          this.valueModel = result.data.selected;
          this.opened = false;
        }
        this.loading = false;
      }
    },
    activateRules() {
      this.rules = {
        newValue: [
          v => !!v || "Required",
          v => (v.length >= 1 && v.length <= 50) || "Must be between 1-50 chars"
        ]
      }
    }
  },
  created() {
    this.items = [{ value: null, text:'' }];
    ApiService.get('/lookup/' + this.type.toLowerCase())
      .then((res) => {
        this.items = res.data.data;
    });
  }
}
</script>

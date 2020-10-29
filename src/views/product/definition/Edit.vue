<template>
  <v-row justify="center">

    <v-dialog v-model="opened" max-width="500" overlay-opacity="0.2">
      <v-card>
        <v-card-title>Product details</v-card-title>
        <v-divider class="mb-2"></v-divider>

        <v-card-text class="pb-0">

          <v-form ref="form" v-model="valid">
            <input type="hidden" :value="form.id" >

            <v-text-field
              autofocus
              label="Code"
              v-model="form.code"
              :rules="rules.code"
              type="text"
              maxlength="50"
            />

            <v-text-field
              label="Name"
              v-model="form.name"
              :rules="rules.name"
              type="text"
              maxlength="500"
            />

            <v-text-field
              label="Price"
              v-model="form.price"
              :rules="rules.price"
              @blur="formatPrice"
              maxlength="10"
            />

            <v-combobox
              v-model="form.tags"
              :items="tagData.items"
              :search-input.sync="tagData.search"
              hide-selected
              hint="Maximum of 5 tags"
              label="Tags"
              multiple
              persistent-hint
              small-chips
            >
              <template v-slot:no-data>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>
                      To create "<strong>{{ tagData.search }}</strong>". Press <kbd>enter</kbd>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-combobox>

          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small @click="close">Close</v-btn>
          <v-btn
            small
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
import ProductService from '@/service/product';
import TagService from '@/service/tag';
import Utility from '@/helpers/utility';

export default {
  data() {
    return {
      opened: false,
      loading: false,
      valid: false,
      rules: {},
      form: {
        code: '',
        name: '',
        price: 0,
        tags: [],
      },
      tagData: {
        items: [],
        search: null,
      },
      oldTags: [],
    };
  },
  methods: {
    open(data) {
      this.opened = true;

      if (data) {
        this.form.id = data.id;
        this.form.code = data.code;
        this.form.name = data.name;
        this.form.price = data.price;
        if (data.tags?.length) this.form.tags = data.tags;
        this.oldTags = this.form.tags;
      }

      let self = this;
      this.$nextTick(() => {
        self.$refs.form.resetValidation();

        TagService.getAll()
          .then((res) => {
            this.tagData.items = [];
            if (res && res.data) {
              if (res.data) {
                for (let i=0; i<res.data.length; i++) {
                  this.tagData.items.push(res.data[i].name);
                }
              }
            }
        });

      });
    },
    async save() {
      this.activateRules();
      await this.$refs.form.validate();
      if (this.valid) {
        this.loading = true;
        this.form.price = parseFloat(this.form.price);
        this.form.tagsChanged = !Utility.arraysEqual(this.oldTags, this.form.tags);

        const result = await ProductService.save(this.form);
        if (result == true) {
          this.close();
          this.$emit('saved');
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
        code: [
          v => !!v || "Code is required",
          v => (v.length >= 3 && v.length <= 50) || "Code must be between 3-50 chars"
        ],
        name: [
          v => !!v || "Name is required",
          v => (v.length >= 3 && v.length <= 500) || "Name must be between 3-500 chars"
        ],
        price: [
          v => (v && parseFloat(v) > 0) || "Price must be greater than 0"
        ],
      }
    },
    formatPrice() {
      this.form.price = parseFloat(('0' + this.form.price).replace(/[^\d.]/g, '')).toFixed(2);
    }
  },
  watch: {
    'form.tags' (val) {
      if (val.length > 5) {
        this.$nextTick(() => this.form.tags.pop())
      }
    },
  },
};
</script>

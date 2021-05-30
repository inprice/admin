<template>
  <v-dialog
    v-model="dialog"
    :max-width="500"
    style="zIndex: 200"
    @keydown.esc="close"
    overlay-opacity="0.2"
  >
    <v-card>
      <v-card-title class="justify-space-between">
        <div class="subtitle-1">Please select a group</div>
        <v-btn icon @click.native="close"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <div class="body-2 mx-3 mb-2 mt-5 font-weight-light">
        <v-icon color="green" class="mx-1" >mdi-shield-alert-outline</v-icon>
        You can either select or create a new group by typing.
      </div>

      <v-combobox
        autofocus
        dense
        outlined
        class="pa-4 mt-2 pb-1"
        label="Group"
        :items="groupNames"
        :messages="messages"
        :error="messages != null"
        v-model="selectedName"
        @input.native="selectedName=$event.srcElement.value"
        @keyup.native.enter="agree"
      ></v-combobox>

      <v-divider></v-divider>

      <v-card-actions class="py-3 mr-2 justify-end">
        <v-btn
          text
          @click="agree"
          :disabled="$store.get('session/isNotEditor')"
        >
          OK
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import GroupService from '@/service/group';

export default {
  name: 'GroupSelect',
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
      dialog: false,
      resolve: null,
      title: null,
      callback: null,
      groups: [],
      groupNames: [],
      selectedName: null,
      callerGroupId: null,
      messages: null,
    };
  },
  methods: {
    open(title, callerGroupId) {
      this.dialog = true;
      this.title = title;
      this.callerGroupId = callerGroupId;

      GroupService.getIdNameList().then((res) => {
        if (res && res.data) {
          const names = [];
          res.data.forEach(group => {
            this.groups[group.value.toLowerCase()] = group.key; //in order to finding id by name!
            if (group.key != callerGroupId) {
              names.push(group.value);
            }
          });
          this.groupNames = names;
        }
      });
      return new Promise((callback) => this.callback = callback);
    },
    agree() {
      if (this.selectedName) {
        const id = this.groups[this.selectedName.toLowerCase()];
        if (!id || id != this.callerGroupId) {
          this.close({ id, name: this.selectedName });
        } else {
          this.messages = 'Same group, please select different one!';
        }
      } else {
        this.messages = 'Please select a group!';
      }
    },
    close(selected) {
      this.callback(selected);
      this.dialog = false;
      this.selectedName = null;
      this.messages = null;
      this.groups = {};
      this.groupNames = [];
    }
  }
}
</script>

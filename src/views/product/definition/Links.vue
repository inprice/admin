<template>
  <div>

    <div class="d-flex justify-space-between ml-2 mt-5">
      <span class="title">
        Competitors
      </span>
      <v-btn 
        :disabled="$store.get('session/isViewer')"
        small
        v-if="!showAddNewBar"
        color="info"
        @click="openAddNewBar">
          <v-icon>mdi-plus</v-icon>Add new
      </v-btn>
    </div>

    <div v-if="prodId">
      <v-form ref="addNewForm" v-model="isUrlValid" @submit.prevent>
        <v-scroll-x-transition leave-absolute>
          <div v-if="showAddNewBar" class="d-flex">
            <v-text-field 
              autofocus
              v-model="url"
              :rules="rules.url"
              label="URL of competitor's product page"
              @keyup.enter.native="addNew"
              @keyup.esc.native="clearAddNewBar(true)"
              dense outlined light
              class="col pl-2 pt-2"
              maxlength="1024"
              placeholder="https://www.amazon.com/dp/754">
                <template slot="append">
                  <v-icon class="mr-2" @click="addNew">mdi-check</v-icon>
                  <v-icon @click="clearAddNewBar(true)">mdi-window-close</v-icon>
                </template>          
            </v-text-field>

            <v-btn icon small class="ma-2 mt-3" elevation="1" @click="helperDialog = true">
              <v-icon>mdi-help-circle-outline</v-icon>
            </v-btn>
          </div>
        </v-scroll-x-transition>

      </v-form>

      <v-dialog
        v-model="helperDialog"
        transition="dialog-top-transition"
        :max-width="findDialogWidth"
      >
        <v-card>
          <v-card-title class="headline">
            Rules for urls
          </v-card-title>

          <v-divider class="mb-2"></v-divider>

          <v-card-text class="">
            <span class="font-weight-medium">Please keep in mind when adding new url</span>
            <ul>
              <li>URL must be the exact address of your competitor's product page.</li>
              <li>At least, Code, Name and Price fields should be displayed on the page it refers.</li>
              <li>It must start with either http:// or https://</li>
              <li>It cannot be less than 10 chars.</li>
              <li>You can save it by pressing Enter or click Save icon on the right.</li>
              <li>Or cancel by pressing Esc or click Cancel icon on the most right.</li>
              <li>You can add consecutive URLs without cancelling.</li>
              <li>Valid examples
                <ul>
                  <li>https://www.amazon.com/dp/754</li>
                  <li>https://www.ebay.com/itm/754</li>
                  <li>https://www.argos.co.uk/product/754</li>
                </ul>
              </li>
            </ul>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="green darken-1"
              text
              @click="helperDialog = false"
            >
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>        

    </div>
    <div v-else>
      Invalid product!
    </div>

    <div v-if="rows && rows.length > 0" :class="{ 'mt-4': !showAddNewBar }">

      <v-hover v-for="(row, index) in rows" :key="row.id">
        <template v-slot="{ hover }">

          <v-card class="mb-5 pa-2 pb-3 transition-swing" :class="`elevation-${hover ? 6 : 2}`">
            <div @click="toggleDetails(index)" style="cursor: pointer">
              <div class="d-flex justify-space-between subtitle font-weight-normal">
                <div :class="row.name ? '' : 'font-italic text-lowercase pink--text'">{{ row.name || (row.status == 'TOBE_CLASSIFIED' ? 'WILL BE SET SOON' : row.problem) }}</div>
                <div class="pl-2 cyan--text font-weight-bold">{{ row.price | toPrice }}</div>
              </div>

              <v-divider class="my-2"></v-divider>

              <div class="d-flex justify-space-between caption">
                <div v-if="row.seller">{{ row.seller }} ({{ row.platform }})</div>
                <div v-else>#{{ row.sku || (row.status == 'TOBE_CLASSIFIED' ? 'WAITING' : 'NOT SET') }}</div>
                <div>{{ row.position | toPosition }}</div>
              </div>

              <div class="d-flex justify-space-between caption">
                <div class="text-truncate">
                  <a :href="row.url" target="_blank">{{ row.url }}</a>
                </div>
                <div>{{ row.status.replaceAll('_', ' ') }}</div>
              </div>
            </div>

            <v-divider class="my-2" />

            <div class="row mx-0 d-flex" :class="$vuetify.breakpoint.xsOnly ? 'justify-center' : 'justify-end'">
              <div>
                <v-btn 
                  :disabled="$store.get('session/isViewer')"
                  small
                  class="mx-1"
                  @click="toggleStatus(index, row.id)">
                    <span v-if="row.status=='PAUSED'">Resume</span>
                    <span v-else>Pause</span>
                </v-btn>
                <v-btn
                  :disabled="$store.get('session/isViewer')"
                  small
                  class="mx-1"
                  @click="remove(index, row.id, (row.name || row.url))">
                    Delete
                  </v-btn>
              </div>
            </div>

            <link-details
              :data="row"
              :key="row.detailsRefreshCount"
              :class="{ 'mt-2' : $vuetify.breakpoint.xsOnly }"
              v-if="showingIndex==index && showDetails==true"
            />

          </v-card>

        </template>
      </v-hover>

    </div>

    <div v-else class="mt-1">
      <block-message v-if="!showAddNewBar" dense>
        You can add your competitors using the button just above.
      </block-message>
    </div>

    <confirm ref="confirm"></confirm>

  </div>

</template>

<script>
import LinkService from '@/service/link';
import Utility from '@/helpers/utility';
import normalizeUrl from 'normalize-url';
import moment from 'moment-timezone';

export default {
  props: ["prodId", "links"],
  computed: {
    findDialogWidth() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return '80%';
        case 'sm': return '50%';
        case 'md': return '35%';
        case 'lg': return '27%';
        default: return '20%';
      }
    },
  },
  data() {
    return {
      url: '',
      isUrlValid: false,
      loading: false,
      helperDialog: false,
      showAddNewBar: false,
      rules: {},
      rows: [],
      rulesPopup: false,
      selectedTab: 0,
      showingIndex: -1,
      showDetails: false,
    }
  },
  methods: {
    openAddNewBar() {
      this.showAddNewBar = true;
    },
    clearAddNewBar(hide=false) {
      this.rules = {};
      this.url = '';
      if (hide == true) {
        this.showAddNewBar = false;
      }
    },
    async addNew() {
      if (!this.url) return;
      this.url = normalizeUrl(this.url, { defaultProtocol: 'https:', removeQueryParameters: ['ref'] });
      if (Object.keys(this.rules).length == 0) this.activateRules();
      await this.$refs.addNewForm.validate();
      if (this.isUrlValid) {

        const alreadyAdded = this.rows.some(link => link.url === this.url);
        if (alreadyAdded) {
          this.$store.commit('snackbar/setMessage', { text: 'This url is already added!' });
          return;
        }

        this.loading = true;
        const result = await LinkService.insert({ url: this.url, productId: this.prodId });
        if (result.status == true) {
          this.clearAddNewBar();
          const createdAt = moment();
          result.data.historyList = [{ status: 'TOBE_CLASSIFIED', createdAt }];
          this.rows.push(result.data);
          this.$store.commit('snackbar/setMessage', { text: 'URL is successfully added.' });
        }
        this.loading = false;
      }
    },
    toggleDetails(index) {
      if (this.showingIndex == index) {
        this.showDetails = !this.showDetails;
      } else {
        this.showingIndex = index;
        this.showDetails=true;
      }
    },
    async toggleStatus(index, id) {
      let status = 'PAUSED';
      if (this.rows[index].historyList[0].status == status) {
        status = this.rows[index].historyList[1].status;
      }

      if (this.rows[index].historyList.length > 2) {
        const row0 = this.rows[index].historyList[0];
        const row2 = this.rows[index].historyList[2];
        if (row0.status == row2.status) {
          const now = moment();
          const diff0 = now.diff(row0.createdAt, 'days');
          const diff2 = now.diff(row2.createdAt, 'days');
          if (diff0 == 0 && diff2 == 0) {
            this.$store.commit('snackbar/setMessage', { text: 'You are not allowed to Pause/Resume a link more than twice in the same day!' });
            return;
          }
        }
      }

      await LinkService.toggleStatus(id);

      const select = (status == 'PAUSED' ? 0 : 1);
      const newOne = JSON.parse(JSON.stringify(this.rows[index].historyList[select]));
      newOne.status = status;
      if (select == 0) {
        newOne.problem = null;
        newOne.httpStatus = 0;
      }
      this.rows[index].historyList.unshift(newOne);
      this.$emit("statusToggled");
      this.showingIndex = index;
      this.showDetails = true;
    },
    remove(index, id, name) {
      this.$refs.confirm.open('Delete', 'will be deleted. Are you sure?', name).then(async (confirm) => {
        if (confirm == true) {
          const result = await LinkService.remove(id);
          if (result == true) {
            this.rows.splice(index, 1);
            this.$store.commit('snackbar/setMessage', { text: 'URL is successfully deleted.' });
            this.$emit("deleted");
          }
        }
      });
    },
    activateRules() {
      this.rules = {
        url: [
          v => !!v || "Required",
          v => (v.length >= 10 && v.length <= 1024) || "URL must be longer than 10 chars",
          v => Utility.verifyURL(v) || "Invalid URL! It must be the exact address of your link's product page.",
        ],
      }
    },
  },
  components: {
    Confirm: () => import('@/component/Confirm.vue'),
    LinkDetails: () => import('@/views/link/components/LinkDetails.vue'),
    BlockMessage: () => import('@/component/simple/BlockMessage.vue')
  },
  created() {
    this.$nextTick(() => {
      this.rows = this.links
    });
  },
  watch: {
    links() {
      this.rows = this.links;
    }
  }
};
</script>

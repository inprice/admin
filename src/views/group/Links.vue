<template>
  <div>

    <div class="d-flex justify-space-between mt-4">
      <v-btn-toggle tile :value="selectedTabIndex" :style="{ display : ($vuetify.breakpoint.xsOnly ? 'block' : 'inline-flex') }">
        <v-btn 
          v-for="(data, name, index) in groups" :key="index" 
          @click="selectedTabIndex=index; selectedTabName=name;"
          :class="{'font-weight-bold' : (data.links.length), 'caption': true}"
          style="height: 30px">
            {{ `${name} (${data.links.length})` }}
        </v-btn>
      </v-btn-toggle>
      <div class="d-flex mb-1 pb-0" v-if="groups[selectedTabName].links.length">
        <v-checkbox
          hide-details="true"
          class="mt-0 mx-3"
          label="Selection"
          :v-model="groups[selectedTabName].selected.length > 0 && groups[selectedTabName].selected.length == groups[selectedTabName].links.length"
          :indeterminate="groups[selectedTabName].selected.length > 0 && groups[selectedTabName].selected.length != groups[selectedTabName].links.length"
          @click="changeSelection(groups[selectedTabName])"
        ></v-checkbox>
        <v-btn 
          small
          class="mb-1"
          :disabled="groups[selectedTabName].selected.length < 1">
            Delete {{ groups[selectedTabName].selected.length }}
        </v-btn>
      </div>
    </div>

    <v-tabs v-model="selectedTabIndex" class="v-card theme--light">

      <v-tab-item 
        v-for="(data, name, index) in groups" :key="index" 
        :transition="false" :reverse-transition="false"
        @click="selectedTabIndex=index; selectedTabName=name;">

        <div v-if="data.links.length">
          <v-card v-for="row in data.links" :key="row.index" class="pa-2" tile>

            <div class="d-flex">

              <v-checkbox
                hide-details
                class="mt-0 pt-0"
                v-model="data.selected"
                :value="row.id"
              ></v-checkbox>

              <div class="subtitle" :class="row.name ? '' : 'text-lowercase'">
                {{ row.name || (row.statusGroup == 'PROBLEM' ? row.problem : 'WILL BE HANDLED SOON' ) }}
              </div>

              <v-spacer></v-spacer>

              <div>
                <span class="pl-2 mr-1 cyan--text font-weight-bold">{{ row.price | toPrice }}</span>
                <v-btn
                  icon fab small
                  @click="toggleDetails(row)"
                >
                  <v-icon v-if="showDetails && showingIndex == row.index">mdi-chevron-up</v-icon>
                  <v-icon v-else>mdi-chevron-down</v-icon>
                </v-btn>
              </div>
            </div>

            <div v-if="showingIndex==row.index && showDetails==true" class="my-2">
              <v-divider class="mb-2"></v-divider>

              <div class="d-flex justify-space-between caption">
                <div v-if="row.seller">{{ row.seller }} ({{ row.platform }})</div>
                <!-- div v-else>#{{ row.sku || (row.status == 'TOBE_CLASSIFIED' ? 'WAITING' : 'NOT SET') }}</div -->
                <div>{{ row.position | toPosition }}</div>
              </div>

              <div class="d-flex justify-space-between caption">
                <div class="text-truncate">
                  <a :href="row.url" target="_blank">{{ row.url }}</a>
                </div>
                <!-- div>{{ row.status.replaceAll('_', ' ') }}</div -->
              </div>

              <link-details
                class="mt-2"
                :data="row"
                :key="row.detailsRefreshCount"
              />
            </div>
          </v-card>
        </div>

        <block-message 
          v-else dense
          :message="'No data.'"
        />

      </v-tab-item>
    </v-tabs>

    <confirm ref="confirm"></confirm>

  </div>

</template>

<script>
import LinkService from '@/service/link';
//import moment from 'moment-timezone';

export default {
  props: ["groupId", "links"],
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
      selectedTabIndex: 0,
      selectedTabName: 'ACTIVE',
      loading: false,
      helperDialog: false,
      rulesPopup: false,
      showingIndex: -1,
      showDetails: false,
      groups: {
        ACTIVE: { links: [], selected: [] },
        PROBLEM: { links: [], selected: [] },
        TRYING: { links: [], selected: [] },
        WAITING: { links: [], selected: [] },
      }
    }
  },
  methods: {
    toggleDetails(row) {
      if (this.showingIndex == row.index) {
        this.showDetails = !this.showDetails;
      } else {
        this.showingIndex = row.index;
        this.showDetails = true;
      }
    },
    remove(row) {
      this.$refs.confirm.open('Delete', 'will be deleted. Are you sure?', (row.name || row.url)).then(async (confirm) => {
        if (confirm == true) {
          const data = await LinkService.remove(row.id);
          if (data) {
            this.rows.splice(row.index, 1);
            this.$store.commit('snackbar/setMessage', { text: 'URL successfully deleted.' });
            this.$store.commit('session/CHANGE_LINK_COUNT', -1);
            this.$emit("deleted");
          }
        }
      });
    },
    changeSelection(data) {
      if (data.selected.length > 0) {
        data.selected = [];
      } else {
        data.links.forEach(link => {
          data.selected.push(link.id);
        });
      }
    },
    convertLinksToStatusGroup() {
      if (this.links) {
        this.links.forEach((link, index) => {
          link.index = index;
          this.groups[link.statusGroup].links.push(link);
        });
      }
    }
  },
  components: {
    BlockMessage: () => import('@/component/simple/BlockMessage.vue'),
    Confirm: () => import('@/component/Confirm.vue'),
    LinkDetails: () => import('@/views/link/components/LinkDetails.vue'),
  },
  created() {
    this.$nextTick(() => {
      this.convertLinksToStatusGroup();
    });
  },
  watch: {
    links() {
      this.convertLinksToStatusGroup();
    }
  }
};
</script>

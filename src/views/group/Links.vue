<template>
  <div>

    <div>
      <v-btn-toggle tile :value="selectedTabIndex" :style="{ display : ($vuetify.breakpoint.xsOnly ? 'block' : 'inline-flex') }">
        <v-btn 
          v-for="(data, name, index) in groups" :key="index" 
          @click="selectedTabIndex=index; selectedTabName=name;"
          :class="{'font-weight-bold' : (data.links.length)}"
          style="height: 30px">
            {{ `${name} (${data.links.length})` }}
        </v-btn>
      </v-btn-toggle>

      <v-card tile v-if="groups[selectedTabName].links.length > 1">
        <div class="d-flex">
          <v-checkbox
            hide-details="true"
            class="ma-2"
            style="min-width: 120px;"
            :label="(!groups[selectedTabName].selected.length ? 'Select All' : 'Deselect All')"
            :value="groups[selectedTabName].selected.length == groups[selectedTabName].links.length"
            :indeterminate="groups[selectedTabName].selected.length > 0 && groups[selectedTabName].selected.length != groups[selectedTabName].links.length"
            @click="changeSelection(groups[selectedTabName])"
          ></v-checkbox>

          <div class="mt-2">
            <v-btn
              small
              class="mx-1"
              :disabled="groups[selectedTabName].selected.length < 1"
              @click="moveMultiple(selectedTabName)"
            >
              Move
            </v-btn>

            <v-btn 
              small
              class="mx-1"
              :disabled="groups[selectedTabName].selected.length < 1"
              @click="removeMultiple(selectedTabName)">
                Delete ({{ groups[selectedTabName].selected.length }})
            </v-btn>
          </div>

        </div>
      </v-card>
    </div>

    <v-tabs v-model="selectedTabIndex" class="v-card theme--light">

      <v-tab-item 
        v-for="(data, name, index) in groups" :key="index" 
        :transition="false" :reverse-transition="false"
        @click="selectedTabIndex=index; selectedTabName=name;"
      >

        <div v-if="data.links.length">

          <v-card 
            tile 
            v-for="row in data.links" 
            class="pa-2"
            :class="(showingId==row.id && showDetails==true ? 'elevation-5' : '')"
            :key="row.id" 
            :style="(showingId==row.id && showDetails==true ? 'margin: 15px 0; border-left: 5px solid red !important' : 'margin: 10px 0')"
          >
            <div 
              class="d-flex align-center" 
              @click="toggleDetails(row)" 
              style="cursor: pointer"
            >

              <v-checkbox
                hide-details
                class="mt-0 pt-0"
                v-model="data.selected"
                :value="row.id"
                @click.stop=""
                v-if="groups[selectedTabName].links.length > 1"
              ></v-checkbox>

              <div style="cursor: pointer; flex: 1">
                <div class="subtitle-1" v-if="row.name">
                  {{ row.name }}
                </div>
                <div class="body-2 text-lowercase" v-else>
                  {{ row.url }}
                </div>
              </div>

              <div>
                  <div v-if="row.price">
                    <div 
                      v-if="row.level != 'AVG'" 
                      :class="findLevelColor(row.level) + '--text caption font-weight-bold text-center'"
                    >
                      {{ row.level }}
                    </div>
                    <span
                      :class="findLevelColor(row.level) + '--text font-weight-medium'">
                        {{ row.price | toPrice }}
                    </span>
                  </div>

                  <div      
                    v-if="!row.price"
                    class="caption text-right">
                      <div class="blue--text font-weight-medium">{{ row.statusGroup != 'WAITING' ? 'Checked' : 'Added' }}</div>
                      <ago :date="(row.checkedAt || row.createdAt)" />
                  </div>
              </div>

              <div>
                <v-menu offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      small icon
                      class="mx-1"
                      v-bind="attrs"
                      v-on="on"
                      @click.stop=""
                    >
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>

                  <v-list dense>
                    <v-list-item link @click="toggleDetails(row)" v-if="row.name">
                      <v-list-item-title>{{ showingId==row.id && showDetails==true ? 'CLOSE' : 'SHOW' }} DETAILS</v-list-item-title>
                    </v-list-item>

                    <v-divider v-if="row.name"></v-divider>

                    <v-list-item link @click="removeOne(row)">
                      <v-list-item-title>DELETE THIS</v-list-item-title>
                    </v-list-item>

                    <v-divider v-if="row.name"></v-divider>
                    <v-list-item link @click="copyTheLink(row.url)">
                      <v-list-item-title>COPY URL</v-list-item-title>
                    </v-list-item>

                    <v-list-item link target="_blank" :href="row.url">
                      <v-list-item-title>OPEN NEW TAB</v-list-item-title>
                    </v-list-item>

                    <v-divider></v-divider>
                    <v-list-item link @click="moveOne(row)">
                      <v-list-item-title>MOVE</v-list-item-title>
                    </v-list-item>

                  </v-list>
                </v-menu>
              </div>
            </div>

            <div class="caption link-info-wrapper" @click="toggleDetails(row)">
              <div class="link-info">
                <div v-if="row.seller">
                  <div class="caption" v-if="row.platform">{{ row.platform.name }}</div>
                  <div class="caption font-weight-medium">{{ row.seller }}</div>
                </div>
                <div v-if="row.shipment">
                  <div class="caption">SHIPMENT</div>
                  <div class="caption font-weight-medium">{{ row.shipment }}</div>
                </div>
                <div v-if="row.checkedAt && row.statusGroup == 'ACTIVE'">
                  <div class="caption">CHECKED AT</div>
                  <div class="caption font-weight-medium">
                    <ago :date="(row.checkedAt || row.createdAt)" />
                  </div>
                </div>
                <div class="problem-cell" v-if="row.statusGroup == 'PROBLEM' || row.statusGroup == 'TRYING'">
                  <div class="body-2">{{ row.statusDescription }}</div>
                </div>
              </div>
            </div>

            <div v-if="showingId==row.id && showDetails==true" class="my-2">
              <v-divider class="mb-2"></v-divider>
              <div>
                <v-icon class="mr-1">mdi-link</v-icon>
                <a class="caption" :href="row.url" target="_blank">{{ row.url }}</a>
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
          :message="`No ${selectedTabName.toLowerCase()} link.`"
        />

      </v-tab-item>
    </v-tabs>

    <confirm ref="confirm"></confirm>
    <group-select ref="groupSelect"></group-select>

  </div>

</template>

<script>
import LinkService from '@/service/link';

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
    }
  },
  data() {
    return {
      selectedTabIndex: 0,
      selectedTabName: 'ACTIVE',
      loading: false,
      helperDialog: false,
      rulesPopup: false,
      showingId: -1,
      showDetails: false,
      showCopiedTT: false,
      groups: {
        ACTIVE: { links: [], selected: [] },
        PROBLEM: { links: [], selected: [] },
        TRYING: { links: [], selected: [] },
        WAITING: { links: [], selected: [] },
      },
    }
  },
  methods: {
    toggleDetails(row) {
      if (!row.name) return;
      if (this.showingId == row.id) {
        this.showDetails = !this.showDetails;
      } else {
        this.showingId = row.id;
        this.showDetails = true;
      }
    },
    removeOne(row) {
      this.$refs.confirm.open('Delete', 'will be deleted. Are you sure?', (row.name || row.url)).then(async (confirm) => {
        if (confirm == true) {
          const data = await LinkService.remove([ row.id ], this.groupId);
          if (data) {
            for (var i=0; i<this.groups[row.statusGroup].links.length; i++) {
              if (this.groups[row.statusGroup].links[i].id == row.id) {
                this.groups[row.statusGroup].links.splice(i, 1);
                break;
              }
            }
            this.$store.commit('snackbar/setMessage', { text: (row.name || row.url) + ' successfully deleted.' });
            this.$store.commit('session/SET_LINK_COUNT', data.linkCount);
            this.spliceSelected(row.statusGroup, [ row.id ]);
          }
        }
      });
    },
    removeMultiple(groupName) {
      const selected = this.groups[groupName].selected;
      if (selected && selected.length) {
        const title = `${selected.length} ${groupName} links`;
        this.$refs.confirm.open('Delete', ' will be deleted. Are you sure?', title).then(async (confirm) => {
          if (confirm == true) {
            const data = await LinkService.remove(selected, this.groupId);
            if (data) {
              for (var i=0; i<this.groups[groupName].links.length; i++) {
                if (selected.includes(this.groups[groupName].links[i].id)) {
                  this.groups[groupName].links.splice(i, 1);
                  i--;
                }
              }
              this.$store.commit('snackbar/setMessage', { text: title + ' successfully deleted.' });
              this.$store.commit('session/SET_LINK_COUNT', data.linkCount);
              this.spliceSelected(groupName, selected);
            }
          }
        });
      }
    },
    moveOne(row) {
      this.$refs.groupSelect.open('For the selected link, please select a group to move', this.groupId).then(async (data) => {
        if (data && (data.id || data.name)) {
          const result = await LinkService.moveTo({
            fromGroupId: this.groupId,
            toGroupId: data.id,
            toGroupName: data.name,
            linkIdSet: [ row.id ],
          });
          if (result) {
            for (var i=0; i<this.groups[row.statusGroup].links.length; i++) {
              if (this.groups[row.statusGroup].links[i].id == row.id) {
                this.groups[row.statusGroup].links.splice(i, 1);
                break;
              }
            }
            this.$store.commit('snackbar/setMessage', { text: (row.name || row.url) + ' successfully moved.' });
            this.spliceSelected(row.statusGroup, [ row.id ]);
          }
        }
      });
    },
    moveMultiple(groupName) {
      const selected = this.groups[groupName].selected;
      if (selected && selected.length) {
        this.$refs.groupSelect.open(`For selected ${selected.length} links, please select a group to move`, this.groupId).then(async (data) => {
          if (data && (data.id || data.name)) {
            const result = await LinkService.moveTo({
              fromGroupId: this.groupId,
              toGroupId: data.id,
              toGroupName: data.name,
              linkIdSet: selected,
            });
            if (result) {
              for (var i=0; i<this.groups[groupName].links.length; i++) {
                if (selected.includes(this.groups[groupName].links[i].id)) {
                  this.groups[groupName].links.splice(i, 1);
                  i--;
                }
              }
              this.$store.commit('snackbar/setMessage', { text: `${selected.length} links successfully moved.` });
              this.spliceSelected(groupName, selected);
            }
          }
        });
      }
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
        this.groups = {
          ACTIVE: { links: [], selected: [] },
          PROBLEM: { links: [], selected: [] },
          TRYING: { links: [], selected: [] },
          WAITING: { links: [], selected: [] },
        };
        this.links.forEach(link => {
          this.groups[link.statusGroup].links.push(link);
        });
      }
    },
    spliceSelected(statusGroup, selected) {
      if (this.groups[statusGroup].selected.length == selected.length) {
        this.groups[statusGroup].selected.length = 0;
      } else {
        for (var i=0; i<this.groups[statusGroup].selected.length; i++) {
          if (selected.includes(this.groups[statusGroup].selected[i])) {
            this.groups[statusGroup].selected.splice(i, 1);
            i--;
          }
        }
      }
    },
    copyTheLink(url) {
      this.copyToClipboard(url);
      this.$store.commit('snackbar/setMessage', { text: 'Url copied' });
    }
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
  },
  components: {
    GroupSelect: () => import('./GroupSelect.vue'),
    Confirm: () => import('@/component/Confirm.vue'),
    BlockMessage: () => import('@/component/simple/BlockMessage.vue'),
    LinkDetails: () => import('@/views/link/components/LinkDetails.vue'),
  }
};
</script>

<style scoped>
  .link-info-wrapper {
    cursor: pointer;
  }
  .link-info {
    display: flex;
    flex-wrap: wrap;
    margin-left: 32px;
  }
  .link-info > div {
    flex-basis: 0;
    flex-grow: 1;
  }
  .link-info > div:not(:last-child) {
    margin-right: 10px;
    border-right: 1px solid lightgrey;
    max-width: 180px;
  }
</style>

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
            <v-menu offset-y v-if="linkGroups.length">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small
                  class="mx-1"
                  :disabled="groups[selectedTabName].selected.length < 1"
                  v-bind="attrs"
                  v-on="on"
                >
                  Move Under ...
                </v-btn>
              </template>

              <v-list dense>
                <v-list-item v-for="group in linkGroups" :key="group.id" link @click="moveMultiple(selectedTabName, group)">
                  <v-list-item-title>{{ group.name }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

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
        @click="selectedTabIndex=index; selectedTabName=name;">

        <div v-if="data.links.length">
          <v-card v-for="row in data.links" :key="row.id" class="pa-2" tile :style="(showingId==row.id && showDetails==true ? 'background-color: rgb(230, 230, 230, 0.3)' : '')">

            <div class="d-flex align-center">

              <v-checkbox
                hide-details
                class="mt-0 pt-0"
                v-model="data.selected"
                :value="row.id"
                v-if="groups[selectedTabName].links.length > 1"
              ></v-checkbox>

              <div class="subtitle text-truncate" @click="toggleDetails(row)" style="cursor: pointer; flex: 1" v-if="row.name">
                {{ row.name }}
              </div>
              <div class="caption font-italic text-lowercase text-truncate" @click="toggleDetails(row)" style="cursor: pointer; flex: 1" v-else>
                {{ row.url }}
              </div>

              <div>
                <span
                  v-if="row.price"
                  @click="toggleDetails(row)" style="cursor: pointer"
                  class="pl-2 mr-1 cyan--text font-weight-bold">
                    {{ row.price | toPrice }}
                </span>

                <div      
                  v-else
                  @click="toggleDetails(row)" style="cursor: pointer"
                  class="pl-2 mr-1 caption text-right">
                    <div class="blue--text font-weight-medium">{{ row.checkedAt ? 'Checked' : 'Added' }}</div>
                    <ago :date="row.checkedAt || row.createdAt" />
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
                    >
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>

                  <v-list dense>
                    <v-list-item link @click="toggleDetails(row)">
                      <v-list-item-title>{{ showingId==row.id && showDetails==true ? 'CLOSE' : 'SHOW' }} DETAILS</v-list-item-title>
                    </v-list-item>

                    <v-divider></v-divider>

                    <v-list-item link @click="removeOne(row)">
                      <v-list-item-title>DELETE THIS</v-list-item-title>
                    </v-list-item>

                    <v-divider v-if="linkGroups.length"></v-divider>
                    <v-subheader v-if="linkGroups.length">MOVE UNDER</v-subheader>
                    <v-list-item v-for="group in linkGroups" :key="group.id" link @click="moveOne(row, group)">
                      <v-list-item-title>{{ group.name }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </div>

            <div class="caption" @click="toggleDetails(row)" style="cursor: pointer; flex: 1">
              <div v-if="row.statusGroup == 'WAITING'">
                <div class="d-inline">
                  <span v-if="row.checkedAt">Checked </span>
                  <ago :date="row.checkedAt" />
                </div>
              </div>

              <div v-if="row.seller">
                <b>Seller:</b> {{ row.seller }}
              </div>

              <div v-if="row.statusGroup == 'ACTIVE'">
                <div>
                  <b>Platform:</b> {{ row.platformName }}
                </div>
              </div>

              <div v-if="row.statusGroup == 'PROBLEM'">
                <div>
                  <b>Problem:</b> {{ row.statusProblem }}
                </div>
              </div>
            </div>

            <div v-if="showingId==row.id && showDetails==true" class="my-2">
              <v-divider class="mb-2"></v-divider>

              <div class="d-flex justify-space-between caption">
                <div v-if="row.seller">{{ row.seller }} ({{ row.platformName }})</div>
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
          :message="`No ${selectedTabName.toLowerCase()} link.`"
        />

      </v-tab-item>
    </v-tabs>

    <confirm ref="confirm"></confirm>

  </div>

</template>

<script>
import LinkService from '@/service/link';
import GroupService from '@/service/group';
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
      groups: {
        ACTIVE: { links: [], selected: [] },
        PROBLEM: { links: [], selected: [] },
        TRYING: { links: [], selected: [] },
        WAITING: { links: [], selected: [] },
      },
      linkGroups: []
    }
  },
  methods: {
    toggleDetails(row) {
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
    moveOne(row, to_group) {
      this.$refs.confirm.open('Move', 'will be moved under '+to_group.name+'. Are you sure?', (row.name || row.url)).then(async (confirm) => {
        if (confirm == true) {
          const data = await LinkService.moveTo([ row.id ], to_group.id, this.groupId);
          if (data) {
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
    moveMultiple(groupName, to_group) {
      const selected = this.groups[groupName].selected;
      if (selected && selected.length) {
        const title = `${selected.length} ${groupName} links`;
        this.$refs.confirm.open('Move', 'will be moved under '+to_group.name+'. Are you sure?', title).then(async (confirm) => {
          if (confirm == true) {
            const data = await LinkService.moveTo(selected, to_group.id, this.groupId);
            if (data) {
              for (var i=0; i<this.groups[groupName].links.length; i++) {
                if (selected.includes(this.groups[groupName].links[i].id)) {
                  this.groups[groupName].links.splice(i, 1);
                  i--;
                }
              }
              this.$store.commit('snackbar/setMessage', { text: title + ' successfully moved.' });
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
    }
  },
  created() {
    this.$nextTick(() => {
      this.convertLinksToStatusGroup();
      GroupService.list()
        .then((result) => {
          this.linkGroups = result.filter(group => group.id !== this.groupId);
        });
    });
  },
  watch: {
    links() {
      this.convertLinksToStatusGroup();
    }
  },
  components: {
    BlockMessage: () => import('@/component/simple/BlockMessage.vue'),
    Confirm: () => import('@/component/Confirm.vue'),
    LinkDetails: () => import('@/views/link/components/LinkDetails.vue'),
  }
};
</script>

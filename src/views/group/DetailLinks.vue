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

      <v-card tile v-if="groups[selectedTabName].links.length > 1" :disabled="$store.get('session/isNotEditor')">
        <div class="d-flex">
          <v-checkbox
            hide-details="true"
            class="ma-2"
            style="min-width: 120px;"
            :label="(groups[selectedTabName].selected < 1 ? 'Select All' : 'Deselect All')"
            :value="groups[selectedTabName].selected == groups[selectedTabName].links.length"
            :indeterminate="groups[selectedTabName].selected > 0 && groups[selectedTabName].selected != groups[selectedTabName].links.length"
            @click="changeAllSelection(selectedTabName)"
          ></v-checkbox>

          <div class="mt-2">
            <v-btn
              small
              text outlined
              class="mx-1"
              :disabled="groups[selectedTabName].selected < 1"
              @click="moveMultiple(selectedTabName)"
            >
              Move
            </v-btn>

            <v-btn 
              small
              text outlined
              class="mx-1"
              :disabled="groups[selectedTabName].selected < 1"
              @click="deleteMultiple(selectedTabName)">
                Delete ({{ groups[selectedTabName].selected > 0 ? groups[selectedTabName].selected : 0 }})
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
            v-for="(row, index) in data.links" 
            class="pa-2"
            :key="row.id"
            :loading="detailLoading && loadingId==row.id"
            :class="(showingId==row.id && showDetails==true ? 'elevation-5' : '')"
            :style="(showingId==row.id && showDetails==true ? 'margin: 15px 0; border-left: 5px solid red !important' : 'margin: 10px 0')"
          >
            <template slot="progress">
              <v-progress-linear color="green" indeterminate></v-progress-linear>
            </template>
            <link-row
              :row="row"
              :linksCount="data.links.length"
              :showingId="showingId"
              :showDetails="showDetails"
              :isChecked="row.selected == true"
              :key="linkRefresherKey"
              @rowSelected="changeRowSelection(data, index)"
              @moveOne="moveOne"
              @deleteOne="deleteOne"
              @toggleDetails="toggleDetails"
              @openAlarmDialog="openAlarmDialog(row, name, index)"
            />
          </v-card>
        </div>

        <block-message 
          v-else dense
          :message="`No ${selectedTabName.toLowerCase()} link.`"
        />
      </v-tab-item>
    </v-tabs>

    <alarm-dialog
      ref="alarmDialog"
      @setOff="setAlarmOff"
      @saved="saveAlarm"
    ></alarm-dialog>

    <confirm ref="confirm"></confirm>
    <group-select ref="groupSelect"></group-select>

  </div>

</template>

<script>
import LinkService from '@/service/link';
import AlarmService from '@/service/alarm';

export default {
  props: ["groupId", "links"],
  computed: {
    findDialogWidth() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return '80%';
        case 'sm': return '50%';
        case 'md': return '35%';
        case 'lg': return '27%';
        default: return '18%';
      }
    }
  },
  data() {
    return {
      selectedTabIndex: 0,
      selectedTabName: 'ACTIVE',
      showingId: 0,
      showDetails: false,
      loadingId: 0,
      detailLoading: false,
      groups: {
        ACTIVE: { links: [], selected: 0 },
        PROBLEM: { links: [], selected: 0 },
        TRYING: { links: [], selected: 0 },
        WAITING: { links: [], selected: 0 },
      },
      linkRefresherKey: 0
    }
  },
  methods: {
    async toggleDetails(row) {
      if (this.showingId != row.id) {
        if (!row.details) {
          this.loadingId = row.id;
          this.detailLoading = true;
          const res = await LinkService.getDetails(row.id);
          if (res && res.data) {
            row.details = {
              historyList: res.data.historyList,
              priceList: res.data.priceList,
              specList: res.data.specList
            };
          }
          this.detailLoading = false;
        }
        this.showingId = row.id;
        this.showDetails = true;
      } else {
        this.showDetails = !this.showDetails;
      }
    },
    deleteOne(row) {
      this.$refs.confirm.open('Delete', 'will be deleted. Are you sure?', (row.name || row.url)).then(async (confirm) => {
        if (confirm == true) {
          const result = await LinkService.remove([ row.id ], this.groupId);
          if (result) {
            this.clearSelectedLinks(row.statusGroup, [ row.id ], (row.name || row.url) + ' successfully deleted.', result.group);
          }
        }
      });
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
            this.clearSelectedLinks(row.statusGroup, [ row.id ], (row.name || row.url) + ' successfully moved.', result.group);
          }
        }
      });
    },
    deleteMultiple(groupName) {
      let selection = this.findSelectedIds(groupName);
      if (selection.length) {
        const title = `${selection.length} ${groupName} links`;
        this.$refs.confirm.open('Delete', ' will be deleted. Are you sure?', title).then(async (confirm) => {
          if (confirm == true) {
            const result = await LinkService.remove(selection, this.groupId);
            if (result) {
              this.clearSelectedLinks(groupName, selection, title + ' successfully deleted.', result.group);
            }
          }
        });
      }
    },
    moveMultiple(groupName) {
      let selection = this.findSelectedIds(groupName);
      if (selection.length) {
        const title = `${selection.length} ${groupName} links`;
        this.$refs.groupSelect.open(`For selected ${title}, please select a group to move`, this.groupId).then(async (data) => {
          if (data && (data.id || data.name)) {
            const result = await LinkService.moveTo({
              fromGroupId: this.groupId,
              toGroupId: data.id,
              toGroupName: data.name,
              linkIdSet: selection,
            });
            if (result) {
              this.clearSelectedLinks(groupName, selection, title + ' successfully moved.', result.group);
            }
          }
        });
      }
    },
    findSelectedIds(groupName) {
      let selection = [];
      for (var i=0; i<this.groups[groupName].links.length; i++) {
        const link = this.groups[groupName].links;
        if (link.selected) selection.push(link.id);
      }
      return selection;
    },
    clearSelectedLinks(groupName, selection, title, group) {
      let decreaseByOne = (selection.length == 1 && this.groups[groupName].links[selection[0]]);
      this.groups[groupName].links = this.groups[groupName].links.filter((link)=> selection.includes(link.id) == false);
      if (decreaseByOne) {
        this.groups[groupName].selected -= 1;
      } else {
        this.groups[groupName].selected = 0;
      }
      this.$store.commit('snackbar/setMessage', { text: title });
      this.$emit("refreshGroup", group);
    },
    changeRowSelection(data, index) {
      if (data.links[index].selected) {
        data.selected += 1;
      } else {
        data.selected -= 1;
      }
    },
    changeAllSelection(groupName) {
      const data = this.groups[groupName];
      let selectAll = (data.selected == 0);
      data.links.forEach((link) => link.selected = selectAll);
      if (selectAll == false) {
        data.selected = 0;
      } else {
        data.selected = data.links.length;
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
          link.selected = false;
          this.groups[link.statusGroup].links.push(link);
        });
      }
    },
    openAlarmDialog(link, groupName, index) {
      let cloned = {};
      if (link.alarm) {
        cloned = JSON.parse(JSON.stringify(link.alarm));
      } else {
        cloned = {
          subject: 'STATUS',
          subjectWhen: 'CHANGED',
          priceLowerLimit: 0,
          priceUpperLimit: 0,
        };
      }
      cloned.topic = 'LINK';
      cloned.linkId = link.id;
      cloned.index = index;
      cloned.groupName = groupName;
      cloned.name = link.name || link.url;

      this.$refs.alarmDialog.open(cloned);
    },
    async saveAlarm(selected) {
      const result = await AlarmService.save(selected);
      if (result && result.status) {
        const link = this.groups[selected.groupName].links[selected.index];
        link.alarm = result.data;
        link.alarmId = result.data.id;
        this.linkRefresherKey++;
      }
    },
    setAlarmOff(selected) {
      this.$refs.confirm.open('Remove', 'will be removed. Are you sure?', 'This alarm').then((confirm) => {
        if (confirm == true) {
          const self = this;
          AlarmService.remove(selected.id).then((res) => {
            if (res && res.status) {
              const link = self.groups[selected.groupName].links[selected.index];
              link.alarm = null;
              link.alarmId = null;
              this.linkRefresherKey++;
            }
          });
        }
      });
    },
  },
  mounted() {
    this.convertLinksToStatusGroup();
  },
  watch: {
    links() {
      this.convertLinksToStatusGroup();
    }
  },
  components: {
    LinkRow: () => import('@/views/link/components/Row.vue'),
    GroupSelect: () => import('./Select.vue'),
    AlarmDialog: () => import('@/component/special/AlarmDialog.vue'),
    Confirm: () => import('@/component/Confirm.vue'),
    BlockMessage: () => import('@/component/simple/BlockMessage.vue'),
  }
};
</script>

<style scoped>
  .link-info-wrapper {
    cursor: pointer;
    margin-right: 15px;
    margin-left: 32px;
    border: 1px solid #ddd;
  }
  .link-info {
    display: flex;
    flex-wrap: wrap;
  }
  .link-info > div {
    flex-basis: 0;
    flex-grow: 1;
    padding: 5px 10px;
  }
  .link-info > div:not(:last-child) {
    max-width: 180px;
    border-right: 1px solid lightgrey;
  }
</style>

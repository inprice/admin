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
            @click="changeAllSelection(groups[selectedTabName])"
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
            v-for="(row, index) in data.links" 
            class="pa-2"
            :class="(showingId==row.id && showDetails==true ? 'elevation-5' : '')"
            :key="row.id" 
            :style="(showingId==row.id && showDetails==true ? 'margin: 15px 0; border-left: 5px solid red !important' : 'margin: 10px 0')"
          >
            <link-row
              :row="row"
              :linksCount="data.links.length"
              :showingId="showingId"
              :showDetails="showDetails"
              :isChecked="row.selected"
              @rowSelected="changeRowSelection(data, index)"
              @moveOne="moveOne"
              @deleteOne="deleteOne"
              @copyTheLink="copyTheLink"
              @toggleDetails="toggleDetails"
            />
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
//import Vue from 'vue';
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
      if (this.showingId == row.id) {
        this.showDetails = !this.showDetails;
      } else {
        this.showingId = row.id;
        this.showDetails = true;
      }
    },
    deleteOne(row) {
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
            this.spliceSelected(row.statusGroup, [ row.id ]);
            this.$emit("refreshGroup", data);
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
              this.spliceSelected(groupName, selected);
              this.$emit("refreshGroup", data);
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
            this.$emit("refreshGroup", result);
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
              this.$emit("refreshGroup", result);
            }
          }
        });
      }
    },
    changeRowSelection(data, index) {
      const link = data.links[index];
      if (link.selected) {
        data.selected.push(link.id);
      } else {
        for (let index = 0; index < data.selected.length; index++) {
          if (data.selected[index] == link.id) {
            data.selected.splice(index, 1);
          }
        }
      }
    },
    changeAllSelection(data) {
      let selectAll = (data.selected.length == 0);
      if (!selectAll) data.selected = [];
      for (let index = 0; index < data.links.length; index++) {
        const link = data.links[index];
        if (selectAll) data.selected.push(link.id);
        link.selected = selectAll;
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
      this.$store.commit('snackbar/setMessage', { text: 'Url copied', centered: true, color: 'cyan', timeout: 1100, closeButton: false });
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
    GroupSelect: () => import('./components/Select.vue'),
    Confirm: () => import('@/component/Confirm.vue'),
    BlockMessage: () => import('@/component/simple/BlockMessage.vue'),
    LinkRow: () => import('@/views/link/components/Row.vue'),
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

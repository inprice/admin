<template>
  <div>

    <div v-if="rows.length">

      <div class="d-flex" style="align-items: end;" v-if="rows.length > 1">
        <v-checkbox
          hide-details="true"
          class="mx-2"
          style="min-width: 120px;"
          :label="(!selected ? 'Select All' : 'Deselect All')"
          :value="selected == rows.length"
          :indeterminate="selected > 0 && selected != rows.length"
          @click="changeAllSelection"
        ></v-checkbox>

        <div>
          <v-btn
            small
            class="mx-1"
            @click="toggleMultipleStatus"
            :disabled="!selected || $store.get('session/isNotSuperUser')"
          >
            Pause or Resume
          </v-btn>

          <v-btn 
            small
            class="mx-1"
            @click="resolvedMultiple"
            :disabled="!selected || $store.get('session/isNotSuperUser')"
          >
            Resolved ({{ selected }})
          </v-btn>
        </div>
      </div>

      <v-card 
        tile 
        v-for="(row, index) in rows" 
        class="pa-2 pt-0"
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
          :details="row.details"
          :isChecked="row.selected"
          :linksCount="rows.length"
          :showingId="showingId"
          :showDetails="showDetails"
          :fromSearchPage="true"
          :showMenu="false"
          @toggleDetails="toggleDetails"
          @toggleOneStatus="toggleOneStatus"
          @resolvedOne="resolvedOne"
          @rowSelected="changeRowSelection(index)"
        />
      </v-card>
    </div>

    <block-message 
      v-else dense
      :message="`No link found.`"
    />

    <confirm ref="confirm"></confirm>

  </div>

</template>

<script>
import SU_LinkService from '@/service/super/link';

export default {
  props: ['rows'],
  data() {
    return {
      showingId: 0,
      showDetails: false,
      loadingId: 0,
      detailLoading: false,
      selected: 0
    }
  },
  methods: {
    async toggleDetails(row) {
      if (this.showingId != row.id) {
        if (!row.details) {
          this.loadingId = row.id;
          this.detailLoading = true;
          const res = await SU_LinkService.getDetails(row.id);
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
    toggleOneStatus(row) {
      this.$refs.confirm.open('Toggle Status', 'will be toggled (PAUSED or RESUMED). Are you sure?', (row.name || row.url)).then(async (confirm) => {
        if (confirm == true) {
          const result = await SU_LinkService.toggleStatus([ row.id ]);
          if (result) {
            this.$store.commit('snackbar/setMessage', { text: 'Link\'s status successfully toggled.' });
            this.showingId = 0;
            row.details = null;
            this.toggleDetails(row);
          }
        }
      });
    },
    resolvedOne(row) {
      this.$refs.confirm.open('Resolve', 'will be RESOLVED. Are you sure?', (row.name || row.url)).then(async (confirm) => {
        if (confirm == true) {
          const result = await SU_LinkService.resolved([ row.id ]);
          if (result) {
            this.$store.commit('snackbar/setMessage', { text: 'Link\'s status successfully marked as RESOLVED.' });
            this.showingId = 0;
            row.details = null;
            this.toggleDetails(row);
          }
        }
      });
    },
    toggleMultipleStatus() {
      let selection = this.findSelectedIds();
      if (selection.length) {
        const title = `${selection.length} links`;
        this.$refs.confirm.open('Toggle Status', ' will be PAUSED or RESUMED. Are you sure?', title).then(async (confirm) => {
          if (confirm == true) {
            const result = await SU_LinkService.toggleStatus(selection);
            if (result) {
              this.clearSelected();
              this.$store.commit('snackbar/setMessage', { text: title + ' successfully toggled.' });
              this.$emit('refreshList');
            }
          }
        });
      }
    },
    resolvedMultiple() {
      let selection = this.findSelectedIds();
      if (selection.length) {
        const title = `${selection.length} links`;
        this.$refs.confirm.open('Resolve', ' will be marked as RESOLVED. Are you sure?', title).then(async (confirm) => {
          if (confirm == true) {
            const result = await SU_LinkService.resolved(selection);
            if (result) {
              this.clearSelected();
              this.$store.commit('snackbar/setMessage', { text: title + ' are successfully marked as RESOLVED.' });
              this.$emit('refreshList');
            }
          }
        });
      }
    },
    findSelectedIds() {
      let selection = [];
      for (var i=0; i<this.rows.length; i++) {
        const link = this.rows[i];
        if (link.selected) selection.push(link.id);
      }
      return selection;
    },
    changeRowSelection(index) {
      if (this.rows[index].selected) {
        this.selected += 1;
      } else {
        this.selected -= 1;
      }
    },
    changeAllSelection() {
      let selectAll = (!this.selected || this.selected == 0);
      this.rows.forEach((link) => link.selected = selectAll);
      if (selectAll == false) {
        this.selected = 0;
      } else {
        this.selected = this.rows.length;
      }
    },
    clearSelected() {
      this.selected = 0;
      this.showingId = 0;
      this.showDetails = false;
    },
  },
  components: {
    LinkRow: () => import('../../link/components/Row.vue'),
    Confirm: () => import('@/component/Confirm.vue'),
    BlockMessage: () => import('@/component/simple/BlockMessage.vue'),
  }
};
</script>

<style>
  tr {
    cursor: pointer;
  }
  td {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .v-card {
    overflow-wrap: normal;
  }
</style>

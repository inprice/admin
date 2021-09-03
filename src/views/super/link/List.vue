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
          <v-menu bottom right offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                small
                class="mx-1"
                v-on="on"
                v-bind="attrs"
                :disabled="!selected || $store.get('session/isNotSuperUser')"
              >
                Change Status
              </v-btn>
            </template>

            <v-list dense>
              <v-list-item link @click="changeMultipleStatus('REFRESHED')">
                <v-list-item-title>REFRESHED</v-list-item-title>
              </v-list-item>

              <v-list-item link @click="changeMultipleStatus('RESOLVED')">
                <v-list-item-title>RESOLVED</v-list-item-title>
              </v-list-item>

              <v-list-item link @click="changeMultipleStatus('PAUSED')">
                <v-list-item-title>PAUSED</v-list-item-title>
              </v-list-item>

              <v-list-item link @click="changeMultipleStatus('NOT_SUITABLE')">
                <v-list-item-title>NOT SUITABLE</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-btn 
            small
            class="mx-1"
            @click="undoMultiple"
            :disabled="!selected || $store.get('session/isNotSuperUser')"
          >
            UNDO LAST CHANGE ({{ selected }})
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
          @changeOneStatus="changeOneStatus"
          @undoOne="undoOne"
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
    changeOneStatus(data) {
      this.changeStatusCommon([ data.row.id ], data.newStatus);
    },
    changeMultipleStatus(newStatus) {
      const selection = this.findSelectedIds();
      this.changeStatusCommon(selection, newStatus);
    },
    changeStatusCommon(ids, newStatus) {
      if (ids && ids.length && newStatus) {
        let title = '';
        if (ids.length > 1) {
          title = `${ids.length} links statuses`;
        } else {
          title = 'Link status';
        }
        this.$refs.confirm.open('Change Status', `${title} will be changed to ${newStatus}. Are you sure?`).then(async (confirm) => {
          if (confirm == true) {
            const result = await SU_LinkService.changeStatus(ids, newStatus);
            if (result) {
              this.clearSelected();
              this.$store.commit('snackbar/setMessage', { text: `${title} successfully updated.` });
              this.$emit('refreshList');
            }
          }
        });
      }
    },
    undoOne(row) {
      this.undoCommon([ row.id ]);
    },
    undoMultiple() {
      const selection = this.findSelectedIds();
      this.undoCommon(selection);
    },
    undoCommon(ids) {
      if (ids && ids.length) {
        let title = '';
        if (ids.length > 1) {
          title = `${ids.length} links last transactions `;
        } else {
          title = 'Link\'s last transaction ';
        }
        this.$refs.confirm.open('Undo Last', `${title} will be rolled back. Are you sure?`).then(async (confirm) => {
          if (confirm == true) {
            const result = await SU_LinkService.undo(ids);
            if (result) {
              this.clearSelected();
              this.$store.commit('snackbar/setMessage', { text: `${title} successfully rolled back to previous status.` });
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

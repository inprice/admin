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
            :disabled="!selected"
            @click="moveMultiple"
          >
            Move
          </v-btn>

          <v-btn 
            small
            class="mx-1"
            :disabled="!selected"
            @click="deleteMultiple">
              Delete ({{ selected }})
          </v-btn>
        </div>
      </div>

      <v-card 
        tile 
        v-for="(row, index) in rows" 
        class="pa-2 pt-0"
        :key="row.id" 
        :loading="detailLoading && showingId==row.id"
        :class="(showingId==row.id && showDetails==true ? 'elevation-5' : '')"
        :style="(showingId==row.id && showDetails==true ? 'margin: 15px 0; border-left: 5px solid red !important' : 'margin: 10px 0')"
      >
        <template slot="progress">
          <v-progress-linear color="green" indeterminate></v-progress-linear>
        </template>
        <link-row
          :row="row"
          :linksCount="rows.length"
          :showingId="showingId"
          :showDetails="showDetails"
          :isChecked="row.selected == true"
          :fromSearchPage="true"
          @rowSelected="changeRowSelection(index)"
          @moveOne="moveOne"
          @deleteOne="deleteOne"
          @toggleDetails="toggleDetails"
        />
      </v-card>
    </div>
    <block-message 
      v-else dense
      :message="`No link found.`"
    />

    <confirm ref="confirm"></confirm>
    <group-select ref="groupSelect"></group-select>

  </div>

</template>

<script>
import LinkService from '@/service/link';

export default {
  props: ['rows'],
  data() {
    return {
      showingId: -1,
      showDetails: false,
      detailLoading: false,
      selected: 0
    }
  },
  methods: {
    toggleDetails(row) {
      if (this.showingId == row.id) {
        this.showDetails = !this.showDetails;
      } else {
        this.showingId = row.id;
        this.detailLoading = true;
        LinkService.getDetails(row.id).then((res) => {
          this.detailLoading = false;
          if (res && res.data) {
            row.historyList = res.data.historyList;
            row.priceList = res.data.priceList;
            row.specList = res.data.specList;
            this.showDetails = true;
          } else {
            this.showDetails = false;
          }
        });
      }
    },
    deleteOne(row) {
      this.$refs.confirm.open('Delete', 'will be deleted. Are you sure?', (row.name || row.url)).then(async (confirm) => {
        if (confirm == true) {
          const result = await LinkService.remove([ row.id ], this.groupId);
          if (result) {
            this.selected = 0;
            this.$store.commit('snackbar/setMessage', { text: 'Link successfully deleted.' });
            this.$emit('refreshList');
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
            this.selected = 0;
            this.$store.commit('snackbar/setMessage', { text: 'Link successfully moved.' });
            this.$emit('refreshList');
          }
        }
      });
    },
    deleteMultiple() {
      let selection = this.findSelectedIds();
      if (selection.length) {
        const title = `${selection.length} links`;
        this.$refs.confirm.open('Delete', ' will be deleted. Are you sure?', title).then(async (confirm) => {
          if (confirm == true) {
            const result = await LinkService.remove(selection, this.groupId);
            if (result) {
              this.selected = 0;
              this.$store.commit('snackbar/setMessage', { text: title + ' successfully deleted.' });
              this.$emit('refreshList');
            }
          }
        });
      }
    },
    moveMultiple() {
      let selection = this.findSelectedIds();
      if (selection.length) {
        const title = `${selection.length} links`;
        this.$refs.groupSelect.open(`For selected ${title}, please select a group to move`, this.groupId).then(async (data) => {
          if (data && (data.id || data.name)) {
            const result = await LinkService.moveTo({
              fromGroupId: this.groupId,
              toGroupId: data.id,
              toGroupName: data.name,
              linkIdSet: selection,
            });
            if (result) {
              this.selected = 0;
              this.$store.commit('snackbar/setMessage', { text: title + ' successfully moved.' });
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
  },
  components: {
    LinkRow: () => import('./components/Row.vue'),
    GroupSelect: () => import('@/views/group/Select.vue'),
    Confirm: () => import('@/component/Confirm.vue'),
    BlockMessage: () => import('@/component/simple/BlockMessage.vue'),
  }
};
</script>

<style scoped>
  tr {
    cursor: pointer;
  }
  td {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>

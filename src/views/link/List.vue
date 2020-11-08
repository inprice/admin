<template>
  <div>

    <div v-if="rows && rows.length">

      <v-hover v-for="(row, index) in rows" :key="row.id">
        <template v-slot="{ hover }">

          <v-card class="mb-3 pa-3 transition-swing" :class="`elevation-${hover ? 6 : 2}`">

            <div @click="toggleDetails(row.id)" style="cursor: pointer">
              <div class="d-flex justify-space-between subtitle">
                <div>{{ row.name || row.problem }}</div>
                <div>{{ row.price | toPrice }}</div>
              </div>

              <div class="d-flex justify-space-between caption">
                <div v-if="row.seller">{{ row.seller }} ({{ row.platform }})</div>
                <div v-else>#{{ row.sku || (row.status == 'TOBE_CLASSIFIED' ? 'WAITING' : 'PROBLEM') }}</div>
                <div>{{ row.position | toPosition }}</div>
              </div>

              <div class="d-flex justify-space-between caption">
                <div class="text-truncate font-italic">
                  <a :href="row.url" target="_blank">{{ row.url }}</a>
                </div>
                <div>{{ row.status.replaceAll('_', ' ') }}</div>
              </div>
            </div>

            <v-divider class="my-2" />

            <div class="row mr-0">
              <v-spacer></v-spacer>
              <div>
                <v-btn class="mx-1" small @click="toggleStatus(index, row.id)">
                  <span v-if="row.status=='PAUSED'">Resume</span>
                  <span v-else>Pause</span>
                </v-btn>
                <v-btn class="mx-1" small @click="remove(index, row.id, (row.name || row.url))">Delete</v-btn>
                <v-btn class="mx-1" small @click="openProductPage(row.productId)">Product Page</v-btn>
              </div>
            </div>

            <link-details
              :key="detailsRefreshCount"
              style="margin-top: -20px"
              v-if="showDetails==true && openedDetail && openedDetail.id==row.id"
              :showInfoTab="false"
              :historyList="openedDetail.historyList"
              :priceList="openedDetail.priceList"
              :specList="openedDetail.specList"
            />

          </v-card>

        </template>
      </v-hover>

      <div class="caption mt-3">
        <span class="font-italic font-weight-bold">Please note:</span>
        Click the card to show/hide details panel!
      </div>

    </div>

    <p class="mt-3" v-else>
      No link found! Please change your criteria or add new competitors to your products.
    </p>

    <confirm ref="confirm"></confirm>
  </div>

</template>

<script>
import LinkService from '@/service/link';
import moment from 'moment-timezone';

export default {
  props: ['rows', 'isLoading'],
  data() {
    return {
      detailsRefreshCount: 0,
      showDetails: false,
      openedDetail: null,
      lastToggledLinkId: null,
    }
  },
  methods: {
    remove(index, id, name) {
      this.$refs.confirm.open('Delete', 'will be deleted. Are you sure?', name).then(async (confirm) => {
        if (confirm == true) {
          const result = await LinkService.remove(id);
          if (result == true) {
            this.$store.commit('snackbar/setMessage', { text: 'Link successfully deleted.' });
            this.$emit('deleted', index);
          }
        }
      });
    },
    async toggleStatus(index, id) {
      if (id != this.lastToggledLinkId) {
        await this.toggleDetails(id);
      }

      let status = 'PAUSED';
      if (this.openedDetail.historyList[0].status == status) {
        status = this.openedDetail.historyList[1].status;
      }

      if (this.openedDetail.historyList.length > 2) {
        const row0 = this.openedDetail.historyList[0];
        const row2 = this.openedDetail.historyList[2];
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

      this.$emit('statusToggled', { index, status });
      if (this.openedDetail && this.openedDetail.id == id) {
        const select = (status == 'PAUSED' ? 0 : 1);
        const newOne = JSON.parse(JSON.stringify(this.openedDetail.historyList[select]));
        newOne.status = status;
        if (select == 0) {
          newOne.problem = null;
          newOne.httpStatus = 0;
        }
        newOne.createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
        this.openedDetail.historyList.unshift(newOne);
        this.detailsRefreshCount++;
      } else {
        this.detailsRefreshCount = 0;
      }
    },
    async toggleDetails(id) {
      if (this.openedDetail && this.openedDetail.id == id) {
        this.showDetails = !this.showDetails;
        return;
      }
      const res = await LinkService.getDetails(id);
      if (res && res.data) {
        this.openedDetail = {};
        this.openedDetail.id = id;
        this.openedDetail.historyList = res.data.historyList;
        this.openedDetail.priceList = res.data.priceList;
        this.openedDetail.specList = res.data.specList;
        this.showDetails = true;
      } else {
        this.showDetails = false;
        this.openedDetail = null;
      }
      this.lastToggledLinkId = id;
    },
    openProductPage(productId) {
      this.$router.push({ name: 'product', params: { id: productId } });
    }
  },
  components: {
    confirm: () => import('@/component/Confirm.vue'),
    LinkDetails: () => import('@/views/link/components/LinkDetails.vue'),
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

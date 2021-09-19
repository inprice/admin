<template>

  <div>
    <div>
      <div class="title">Alarms</div>
      <div class="subtitle">
        You can only manage existing alarms here. 
        To add new alarms, you need to use use either 
        <router-link to="products">Products</router-link> or 
        <router-link to="links">Links</router-link> section.
      </div>
    </div>

    <!-- --------------- -->
    <!-- Filter and Rows -->
    <!-- --------------- -->
    <div 
      class="pl-0 d-flex"
      :class="$vuetify.breakpoint.name == 'xs' ? 'col-10' : 'col-6'"
    >
      <v-text-field 
        :loading="loading"
        v-model="searchForm.term"
        dense solo
        maxlength="100"
        hide-details
        placeholder="Search..."
      >
        <template v-slot:append>
          <v-menu
            offset-y
            bottom left
            v-model="filterPanelShow"
            :close-on-content-click="false"
            transition="scale-x-transition"
          >
            <template v-slot:activator="{ on }">
              <v-icon v-on="on">mdi-filter-menu-outline</v-icon>
            </template>
          
            <v-card style="max-width:350px">
              <v-card-text class="pb-1">
                <div class="pb-2 d-flex justify-space-between">
                  <span class="body-1 my-auto">Filters</span>
                  <v-btn
                    icon
                    tabindex="-1"
                    @click="filterPanelShow = false"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </div>
                
                <v-select
                  dense
                  outlined
                  hide-details
                  label="Topic"
                  v-model="searchForm.topic"
                  :items="topicItems"
                  clearable
                  class="mb-4"
                ></v-select>

                <v-select
                  dense
                  small-chips
                  multiple
                  outlined
                  hide-details
                  label="Subject"
                  v-model="searchForm.subjects"
                  :items="subjectItems"
                  class="mb-4"
                ></v-select>

                <v-select
                  dense
                  small-chips
                  multiple
                  outlined
                  hide-details
                  label="When"
                  v-model="searchForm.whens"
                  :items="whenItems"
                  class="mb-4"
                ></v-select>

                <div class="d-flex justify-space-around mb-4">
                  <v-select
                    dense
                    outlined
                    hide-details
                    class="pr-1"
                    label="Order By"
                    v-model="searchForm.orderBy"
                    :items="orderByItems"
                  ></v-select>

                  <v-select
                    dense
                    outlined
                    hide-details
                    class="pl-1"
                    label="Order Dir"
                    v-model="searchForm.orderDir"
                    :items="orderDirItems"
                  ></v-select>
                </div>

                <v-select
                  dense
                  outlined
                  hide-details
                  label="Row Limit"
                  v-model="searchForm.rowLimit"
                  :items="rowLimitItems"
                  class="mb-2"
                ></v-select>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions class="justify-end">
                <v-btn
                  text
                  @click="resetForm"
                  tabindex="-1"
                >
                  RESET
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="applyOptions"
                >
                  APPLY
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </template>
      </v-text-field>
    </div>

    <div
      style="border: 1px solid #ddd;"
      v-if="searchResult && searchResult.length"
    >

      <div
        class="body-2"
        v-for="(row, index) in searchResult" :key="row.id"
      >
        <div v-if="index==0">
          <v-row class="pa-1 mx-0 font-weight-medium">
            <div style="min-width:24px"></div>
            <v-col cols="4">
              When
            </v-col>
            <v-col>
              For
            </v-col>
            <v-btn
              small icon
              class="my-auto"
              disabled
            ></v-btn>
          </v-row>
          <v-divider></v-divider>
        </div>

        <div class="row-wrapper">
          <v-row class="pa-1 mx-1" @click="openAlarmDialog(row)">
            <v-avatar
              class="pa-3 my-auto"
              color="teal"
              size="22"
              label
              outline
              :title="row.topic"
            >
              <span class="white--text font-weight-medium">{{ row.topic.charAt(0) }}</span>
            </v-avatar>

            <v-col cols="4">
              {{ row.when }} <span v-html="whenClause(row)"></span>
            </v-col>
            <v-col>
              {{ row.name }}
            </v-col>

            <v-menu offset-y bottom left>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small icon
                  class="my-auto"
                  v-bind="attrs"
                  v-on="on"
                  @click.stop=""
                >
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>

              <v-list dense>
                <v-list-item @click="openAlarmDialog(row)">
                  <v-list-item-title>EDIT</v-list-item-title>
                </v-list-item>
                <v-list-item @click="setAlarmOff(row)">
                  <v-list-item-title>DELETE</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-row>

        </div>

        <v-divider></v-divider>

      </div>
    </div>

    <v-card v-else >
      <block-message :message="'No alarm found!'" />
    </v-card>

    <div class="mt-3">
      <v-btn @click="loadmore" :disabled="isLoadMoreDisabled" v-if="searchResult.length > 0">More</v-btn>
    </div>

    <alarm-dialog
      ref="alarmDialog"
      @setOff="setAlarmOff"
      @saved="saveAlarm"
    />

    <confirm ref="confirm"></confirm>

  </div>

</template>

<script>
import AlarmService from '@/service/alarm';

const topicItems = ['LINK', 'PRODUCT'];
const subjectItems = ['STATUS', 'PRICE', 	'MINIMUM', 	'AVERAGE', 	'MAXIMUM', 	'TOTAL' ];
const whenItems = ['CHANGED', 'EQUAL', 'NOT_EQUAL', 'INCREASED', 'DECREASED', 'OUT_OF_LIMITS'];
const orderByItems = ['NAME', 'TOPIC', 'SUBJECT', 'WHEN', 'NOTIFIED_AT'];
const orderDirItems = ['ASC', 'DESC'];
const rowLimitItems = [25, 50, 100];

const baseSearchForm = {
  term: '',
  topic: null,
  subjects: null,
  whens: null,
  orderBy: orderByItems[0],
  orderDir: orderDirItems[0],
  rowLimit: rowLimitItems[0],
  rowCount: 0,
}

export default {
  data() {
    return {
      searchForm: JSON.parse(JSON.stringify(baseSearchForm)),
      filterPanelShow: false,
      searchResult: [],
      isLoadMoreDisabled: true,
      isLoadMoreClicked: false,
      topicItems,
      subjectItems,
      whenItems,
      orderByItems,
      orderDirItems,
      rowLimitItems,
      baseSearchForm,
      loading: false,
    };
  },
  methods: {
    openAlarmDialog(row) {
      const cloned = JSON.parse(JSON.stringify(row));
      this.$refs.alarmDialog.open(cloned);
    },
    async saveAlarm(form) {
      const result = await AlarmService.save(form);
      if (result && result.status) this.search();
    },
    setAlarmOff(form) {
      this.$refs.confirm.open('Remove', 'will be removed. Are you sure?', 'This alarm').then((confirm) => {
        if (confirm == true) {
          AlarmService.remove(form.id).then((res) => {
            if (res && res.status) this.search();
          });
        }
      });
    },
    loadmore() {
      this.isLoadMoreClicked = true;
      this.search();
    },
    applyOptions() {
      this.filterPanelShow = false;
      this.search();
    },
    search() {
      this.loading = true;
      if (this.isLoadMoreClicked == true && this.searchResult.length) {
        this.searchForm.rowCount = this.searchResult.length;
        this.searchForm.loadMore = this.isLoadMoreClicked;
      } else {
        this.searchForm.rowCount = 0;
      }

      const loadMore = this.isLoadMoreClicked;
      this.isLoadMoreClicked = false;

      AlarmService.search(this.searchForm, true)
        .then((res) => {
          this.isLoadMoreDisabled = true;
          if (res?.length) {
            if (loadMore == true) {
              this.searchResult = this.searchResult.concat(res);
            } else {
              this.searchResult = res;
            }
          } else {
            if (!loadMore) this.searchResult = [];
          }
          if (res) {
            this.isLoadMoreDisabled = (res.length < this.searchForm.rowLimit);
          }
      }).finally(() => this.loading = false);
    },
    resetForm() {
      this.filterPanelShow = false;
      this.searchForm = JSON.parse(JSON.stringify(baseSearchForm));
      this.search();
    },
    whenClause: (row) => {
      let condition = '';
      switch (row.subjectWhen) {
        case 'EQUAL':
        case 'NOT_EQUAL': {
          condition = `<b style="color:green">${row.subject}</b> is <b style="color:red">${row.subjectWhen}</b> to <b style="color:blue">${row.certainStatus}</b>`;
          break;
        }
        case 'OUT_OF_LIMITS': {
          if (row.amountLowerLimit > 0) {
            condition = `<b style="color:green">${row.subject}</b> is less than <b style="color:red">${row.amountLowerLimit}</b>`;
            if (row.amountUpperLimit > 0) {
              condition += ` or greater than <b style="color:blue">${row.amountUpperLimit}</b>`;
            }
          } else {
            condition += `<b style="color:green">${row.subject}</b> is greater than <b style="color:red">${row.amountUpperLimit}</b>`;
          }
          break;
        }
      
        default:
          condition += `<b style="color:green">${row.subject}</b> is <b style="color:red">${row.subjectWhen}</b>`;
          break;
      }
      return condition.replaceAll('_', ' ');
    }
  },
  mounted() {
    this.search();
  },
  watch: {
    'searchForm.term'() {
      return this.search();
    }
  },
  components: {
    AlarmDialog: () => import('@/component/special/AlarmDialog.vue'),
    Confirm: () => import('@/component/Confirm.vue'),
    BlockMessage: () => import('@/component/simple/BlockMessage.vue')
  },
}
</script>

<style scoped>
  .row-wrapper .row:hover {
    background-color: #eee !important;
    cursor: pointer;
  }
  .col {
    padding: 6px !important;
  }

</style>
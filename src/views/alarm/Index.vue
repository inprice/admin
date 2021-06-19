<template>

  <div>
    <div>
      <div class="title">Alarms</div>
      <div class="subtitle">
        You can only manage existing alarms here. 
        To add new alarms, you need to use use either 
        <router-link to="groups">Groups</router-link> or 
        <router-link to="links">Links</router-link> section.
      </div>
    </div>

    <!-- --------------- -->
    <!-- Filter and Rows -->
    <!-- --------------- -->
    <div class="col-8 pl-0">

      <v-text-field 
        ref="term"
        autofocus
        outlined dense
        hide-details
        maxlength="100"
        v-model="searchForm.term"
        placeholder="Search by Name"
      >
        <template v-slot:append>
          <v-menu
            offset-y
            bottom left
            v-model="searchMenuOpen"
            :close-on-content-click="false"
            max-width="400">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon small
                v-bind="attrs"
                v-on="on"
                tabindex="-1"
              >
                <v-badge
                  dot overlap
                  color="red"
                  :value="!deepEqual(searchForm, baseSearchForm)"
                >
                  <v-icon>mdi-filter-menu-outline</v-icon>
                </v-badge>
              </v-btn>
            </template>

            <v-card>
              <v-card-text class="pb-2">
                <div class="subtitle-1 pb-1 d-flex justify-space-between">
                  <span>Search Options</span>
                  <v-btn
                    icon
                    @click="searchMenuOpen = false"
                    tabindex="-1"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </div>
                
                <v-divider class="py-2"></v-divider>

                <v-select
                  autofocus
                  dense
                  outlined
                  hide-details
                  label="Topic"
                  v-model="searchForm.topic"
                  :items="topicItems"
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
                    class="col pr-1"
                    label="Order By"
                    v-model="searchForm.orderBy"
                    :items="orderByItems"
                  ></v-select>

                  <v-select
                    dense
                    outlined
                    hide-details
                    class="col pl-1"
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
                  Clear
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="applyOptions"
                >
                  OK
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
        <div  v-if="index==0">
            <v-row class="pa-1 mx-0 font-weight-medium">
              <v-col>
                Name
              </v-col>
              <v-col>
                When
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
          <v-row class="px-2 mx-0" @click="openAlarmDialog(row)">
            <v-col>
              {{ row.name }}
            </v-col>
            <v-col>
              {{ row.when }} <span v-html="whenClause(row)"></span>
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
                <v-list-item @click="remove(row.id)">
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
      <v-btn @click="loadmore" :disabled="isLoadMoreDisabled" v-if="searchResult.length > 0">Load More</v-btn>
    </div>

    <alarm-dialog
      ref="alarmDialog"
      @setOff="remove"
      @saved="saveAlarm"
    />

    <confirm ref="confirm"></confirm>

  </div>

</template>

<script>
import AlarmService from '@/service/alarm';

const topicItems = ['LINK', 'GROUP'];
const subjectItems = ['STATUS', 'PRICE', 	'MINIMUM', 	'AVERAGE', 	'MAXIMUM', 	'TOTAL' ];
const whenItems = ['CHANGED', 'EQUAL', 'NOT_EQUAL', 'INCREASED', 'DECREASED', 'OUT_OF_LIMITS'];
const orderByItems = ['NOTIFIED_AT', 'SUBJECT', 'WHEN'];
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
      searchMenuOpen: false,
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
    };
  },
  methods: {
    openAlarmDialog(row) {
      this.$refs.alarmDialog.open(row);
    },
    async saveAlarm(form) {
      const result = await AlarmService.save(form);
      if (result && result.status) this.search();
    },
    remove(id) {
      this.$refs.confirm.open('Remove', 'will be removed. Are you sure?', 'This alarm').then((confirm) => {
        if (confirm == true) {
          AlarmService.remove(id).then((res) => {
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
      this.searchMenuOpen = false;
      this.search();
    },
    search() {
      if (this.isLoadMoreClicked == true && this.searchResult.length) {
        this.searchForm.rowCount = this.searchResult.length;
        this.searchForm.loadMore = this.isLoadMoreClicked;
      } else {
        this.searchForm.rowCount = 0;
      }

      const loadMore = this.isLoadMoreClicked;
      this.isListLoading = true;
      this.isLoadMoreClicked = false;

      AlarmService.search(this.searchForm, true)
        .then((res) => {
          this.isListLoading = false;
          this.isLoadMoreDisabled = true;
          if (res?.length) {
            if (loadMore == true) {
              this.searchResult = this.searchResult.concat(res);
            } else {
              this.searchResult = res;
            }
          } else {
            this.searchResult = [];
          }
          if (res) {
            this.isLoadMoreDisabled = (res.length < this.searchForm.rowLimit);
          }
      });
    },
    resetForm() {
      this.searchMenuOpen = false;
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
          if (row.priceLowerLimit) {
            condition = `<b style="color:green">${row.subject}</b> is less than <b style="color:red">${row.priceLowerLimit}</b>`;
            if (row.priceLowerLimit) {
              condition += ` or greater than <b style="color:blue">${row.priceUpperLimit}</b>`;
            }
          } else {
            condition += `<b style="color:green">${row.subject}</b> is greater than <b style="color:red">${row.priceUpperLimit}</b>`;
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
<template>
  <div>
    <div 
      style="cursor: pointer"
      class="d-flex align-center" 
      @click="$emit('toggleDetails', row)"
    >
      <v-checkbox
        hide-details
        class="mt-0 pt-0"
        :value="isChecked"
        v-model="row.selected"
        :disabled="linksCount < 2"
        @click.stop="$emit('rowSelected')"
      />

      <div style="flex: 1">
        <div
          v-if="fromSearchPage"
          class="caption"
          style="color: #00748B; line-height: inherit"
        >
          <v-badge
            dot
            left
            color="pink"
            title="Alarmed"
            :value="row.alarmId != undefined && fromSearchPage"
          >
            {{ row.groupName }}
          </v-badge>
        </div>

        <div :class="{'body-2 text-lowercase' : row.name }">
          <v-badge
            dot
            left
            color="pink"
            title="Alarmed"
            :value="row.alarmId != undefined && !fromSearchPage"
          >
            {{ row.name || row.url }}
          </v-badge>
        </div>
      </div>

      <div :class="{'mt-2': fromSearchPage}">
          <div class="caption text-right font-weight-medium text-right">
            <v-chip
              small
              label
              outlined
              :color="findLevelColor(row.level)"
              class="mr-1 px-1"
              v-if="row.level != 'NA'" 
            >
              <v-icon small :color="findLevelColor(row.level)" v-if="row.level == 'LOWEST' || row.level == 'HIGHEST'">mdi-star</v-icon>
              {{ row.level }}
              <v-icon small :color="findLevelColor(row.level)" v-if="row.level == 'LOWEST' || row.level == 'HIGHEST'">mdi-star</v-icon>
            </v-chip>
            <v-chip
              small
              label
              outlined
              :color="findStatusColor(row.statusGroup)"
              class="ml-1 px-1"
              v-if="fromSearchPage"
            >
              {{ row.statusGroup }}
            </v-chip>
          </div>
          <div 
            v-if="row.price"
            class="text-right font-weight-medium"
          >
              {{ row.price | toCurrency(row.platform && row.platform.currencyFormat ? row.platform.currencyFormat : null) }}
          </div>

          <div
            v-if="!row.price"
            class="caption text-right d-inline">
              <span>{{ row.statusGroup != 'WAITING' ? 'Checked' : 'Added' }}</span>
              <ago :class="{ 'd-inline' : fromSearchPage || row.level == 'NA' }" :date="(row.checkedAt || row.createdAt)" />
          </div>
      </div>

      <div>
        <v-menu offset-y bottom left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              small icon
              class="mx-1"
              v-on="on"
              v-bind="attrs"
              @click.stop=""
            >
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list dense>
            <v-list-item link @click="$emit('toggleDetails', row)" v-if="row.name">
              <v-list-item-title>{{ showingId==row.id && showDetails==true ? 'CLOSE' : 'SHOW' }} DETAILS</v-list-item-title>
            </v-list-item>

            <v-divider v-if="row.name"></v-divider>

            <v-list-item link v-if="fromSearchPage && showMenu" @click="$router.push({ name: 'group', params: { id: row.groupId } })">
              <v-list-item-title>OPEN GROUP PAGE</v-list-item-title>
            </v-list-item>

            <v-divider v-if="row.name"></v-divider>
            <v-list-item link @click="copyTheLink(row.url)">
              <v-list-item-title>COPY URL</v-list-item-title>
            </v-list-item>

            <v-list-item link target="_blank" :href="row.url">
              <v-list-item-title>OPEN NEW TAB</v-list-item-title>
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item link @click="$emit('deleteOne', row)" v-if="showMenu" :disabled="$store.get('session/isNotEditor')">
              <v-list-item-title>DELETE THIS</v-list-item-title>
            </v-list-item>

            <v-list-item link @click="$emit('moveOne', row)" v-if="showMenu" :disabled="$store.get('session/isNotEditor')">
              <v-list-item-title>MOVE</v-list-item-title>
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item link @click="$emit('openAlarmDialog')" v-if="showMenu" :disabled="$store.get('session/isNotEditor')">
              <v-list-item-title>SET ALARM</v-list-item-title>
            </v-list-item>

            <v-divider v-if="$store.get('session/isSuperUser')"></v-divider>

            <v-list-item 
              link 
              v-if="$store.get('session/isSuperUser') && (row.statusGroup == 'ACTIVE' || row.statusGroup == 'TRYING')"
              @click="$emit('changeOneStatus', { row, newStatus: 'PAUSED' })" 
            >
              <v-list-item-title>PAUSE</v-list-item-title>
            </v-list-item>

            <v-list-item
              link
              v-if="$store.get('session/isSuperUser') && row.status == 'TOBE_IMPLEMENTED'"
              @click="$emit('changeOneStatus', { row, newStatus: 'RESOLVED' })"
            >
              <v-list-item-title>MARK AS RESOLVED</v-list-item-title>
            </v-list-item>

            <v-list-item
              link
              v-if="$store.get('session/isSuperUser') && row.status != 'NOT_SUITABLE'"
              @click="$emit('changeOneStatus', { row, newStatus: 'NOT_SUITABLE' })"
            >
              <v-list-item-title>MARK AS NOT SUITABLE</v-list-item-title>
            </v-list-item>

            <v-divider v-if="$store.get('session/isSuperUser')"></v-divider>

            <v-list-item
              link
              v-if="$store.get('session/isSuperUser')"
              @click="$emit('undoOne', row)"
            >
              <v-list-item-title>UNDO LAST CHANGE</v-list-item-title>
            </v-list-item>

          </v-list>
        </v-menu>
      </div>
    </div>

    <div
      style="cursor: pointer"
      class="caption link-info-wrapper"
      @click="$emit('toggleDetails', row)"
    >
      <div class="link-info">
        <div v-if="row.seller">
          <div class="caption" v-if="row.platform">{{ row.platform.name }}</div>
          <div class="caption font-weight-medium">{{ row.seller }}</div>
        </div>
        <div v-if="row.checkedAt" class="hidden-xs-only">
          <div class="caption">LAST CHECKED</div>
          <div class="caption font-weight-medium">
            <ago :date="row.checkedAt" />
          </div>
        </div>
        <div v-if="row.updatedAt" class="hidden-xs-only">
          <div class="caption">LAST UPDATED</div>
          <div class="caption font-weight-medium">
            <ago :date="row.updatedAt" />
          </div>
        </div>
        <div v-if="row.shipment">
          <div class="caption">SHIPMENT</div>
          <div class="caption font-weight-medium">{{ row.shipment }}</div>
        </div>
        <div v-if="row.statusGroup == 'PROBLEM' || row.statusGroup == 'TRYING'">
          <div class="caption">PROBLEM</div>
          <div class="body-2 font-weight-medium">
            {{ row.statusDescription }}
          </div>
        </div>
      </div>
    </div>

    <row-detail
      class="mt-2"
      :data="row.details"
      :alarm="row.alarm"
      :alarmEditable="showMenu"
      @openAlarmDialog="$emit('openAlarmDialog', row)"
      v-if="showingId==row.id && showDetails==true"
    />

  </div>
</template>

<script>
export default {
  props: {
    row: { type: Object, default: null, },
    linksCount: { type: Number, default: 0, },
    showingId: { type: Number, default: 0, },
    showDetails: { type: Boolean, default: false, },
    isChecked: { type: Boolean, default: false, },
    fromSearchPage: { type: Boolean, default: false, },
    showMenu: { type: Boolean, default: true, },
  },
  methods: {
    copyTheLink(url) {
      this.copyToClipboard(url);
      this.$store.commit('snackbar/setMessage', { text: 'Url copied', centered: true, color: 'cyan', timeout: 1100, closeButton: false });
    }
  },
  components: {
    RowDetail: () => import('./RowDetail.vue'),
  },
}
</script>

<style scoped>
  .link-info {
    display: flex;
    margin-left: 32px;
    margin-right: 15px;
  }
  .link-info > div {
    flex-grow: 0.25;
    padding: 5px;
    border: 1px solid #ddd;
  }
  .link-info > div:first-child {
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
  }
  .link-info > div:last-child {
    flex-grow: 1;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
  }
</style>
<template>
  <v-card class="mt-3 pa-1 pb-2" tile>

    <!-- ------ -->
    <!-- INFO   -->
    <!-- ------ -->
    <v-card-title class="py-1 justify-space-between">
      <span @click="openDetails" :style="fromSearchPage ? 'cursor: pointer;' : ''">{{ group.name }}</span>

      <div>
        <span v-if="group.price"> {{ group.price | toCurrency }}</span>

        <div>
          <v-menu offset-y bottom left :disabled="$store.get('session/isNotEditor')">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                small icon
                class="mx-1"
                v-bind="attrs"
                v-on="on"
                @click.stop=""
              >
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>

            <v-list dense>
              <v-list-item link v-if="fromSearchPage"  @click="openDetails">
                <v-list-item-title>DETAILS</v-list-item-title>
              </v-list-item>

              <v-divider></v-divider>

              <v-list-item link @click="openEditDialog">
                <v-list-item-title>EDIT</v-list-item-title>
              </v-list-item>

              <v-list-item link @click="openAddLinkDialog">
                <v-list-item-title>ADD NEW LINKS</v-list-item-title>
              </v-list-item>

              <v-divider></v-divider>

              <v-list-item link @click="remove">
                <v-list-item-title>DELETE</v-list-item-title>
              </v-list-item>

              <v-divider></v-divider>

              <v-list-item link @click="openAlarmDialog">
                <v-list-item-title>SET ALARM</v-list-item-title>
              </v-list-item>

            </v-list>
          </v-menu>
        </div>
      </div>

    </v-card-title>

    <!-- ------ -->
    <!-- PRICES -->
    <!-- ------ -->
    <div class="d-flex flex-wrap justify-start px-1" @click="openDetails" :style="fromSearchPage ? 'cursor: pointer;' : ''">

      <v-card
        v-if="group.minPrice"
        tile
        outlined
        class="col elevation-1 mr-1 mt-1 py-1"
        :style="{ 'min-width': findMinWidthForCells }"
      >
        <div class="caption text-uppercase font-weight-light">
          Minimum Price
        </div>
        <div class="text-h6">
          <span v-if="$vuetify.breakpoint.smAndDown">
            {{ group.minPrice | toPrice }}
          </span>
          <span v-else>
            {{ group.minPrice | toCurrency }}
          </span>
        </div>
        <div class="caption">
          <span class="font-weight-medium">{{ group.minSeller }}</span> | {{ group.minPlatform }}
        </div>
      </v-card>

      <v-card
        v-if="group.avgPrice"
        tile
        outlined
        class="col elevation-1 mr-1 mt-1 py-1"
        :style="{ 'min-width': findMinWidthForCells }"
      >
        <div class="caption text-uppercase font-weight-light">
          Average Price
        </div>
        <div class="text-h6">
          <span v-if="$vuetify.breakpoint.smAndDown">
            {{ group.avgPrice | toPrice }}
          </span>
          <span v-else>
            {{ group.avgPrice | toCurrency }}
          </span>
        </div>
        <div>
          <span class="font-weight-medium">{{ group.actives }}</span> <span class="caption">active links</span>
        </div>
      </v-card>

      <v-card
        v-if="group.maxPrice"
        tile
        outlined
        class="col elevation-1 mr-1 mt-1 py-1"
        :style="{ 'min-width': findMinWidthForCells }"
      >
        <div class="caption text-uppercase font-weight-light">
          Maximum Price
        </div>
        <div class="text-h6">
          <span v-if="$vuetify.breakpoint.smAndDown">
            {{ group.maxPrice | toPrice }}
          </span>
          <span v-else>
            {{ group.maxPrice | toCurrency }}
          </span>
        </div>
        <div class="caption">
          <span class="font-weight-medium">{{ group.maxSeller }}</span> | {{ group.maxPlatform }}
        </div>
      </v-card>

      <v-card
        v-if="!group.price && group.total"
        tile
        outlined
        class="col elevation-1 mr-1 mt-1 py-1"
        :style="{ 'min-width': findMinWidthForCells }"
      >
        <div class="caption text-uppercase font-weight-light">
          Total
        </div>
        <div class="text-h6">
          <span v-if="$vuetify.breakpoint.smAndDown">
            {{ group.total | toPrice }}
          </span>
          <span v-else>
            {{ group.total | toCurrency }}
          </span>
        </div>
        <div>
          <span class="font-weight-medium">{{ group.linkCount }}</span> <span class="caption">total links</span>
        </div>
      </v-card>

      <v-card
        v-if="group.price"
        tile
        outlined
        class="col elevation-1 mr-1 mt-1 py-1"
        :style="{ 'min-width': findMinWidthForCells }"
      >
        <div class="caption text-uppercase font-weight-light">
          Your Price
        </div>
        <div class="text-h6">
          <span v-if="$vuetify.breakpoint.smAndDown">
            {{ group.price | toPrice }}
          </span>
          <span v-else>
            {{ group.price | toCurrency }}
          </span>
        </div>

        <span :class="findLevelColor(group.level) +'--text caption font-weight-medium'">
          <v-icon small color="cyan">mdi-star</v-icon>
          {{ group.level }}
          <v-icon small color="cyan">mdi-star</v-icon>
        </span>
      </v-card>

      <v-card
        v-if="!group.minPrice"
        tile
        outlined
        class="col elevation-1 mr-1 mt-1 py-1"
        :style="{ 'min-width': findMinWidthForCells }"
      >
        <div class="caption text-uppercase font-weight-light">
          Links
        </div>
        <div class="d-flex">
          <div class="mr-2">
            <span v-if="group.actives" class="font-weight-medium">{{ group.actives }}</span>
            <span v-else class="font-weight-medium">no</span>
            <span class="caption ml-1">active links,</span>
          </div>
          <div>
            <span v-if="group.waitings" class="font-weight-medium">{{ group.waitings }}</span>
            <span v-else class="font-weight-medium">no</span>
            <span class="caption ml-1">waiting links</span>
          </div>
        </div>
        <div class="d-flex">
          <div class="mr-2">
            <span v-if="group.tryings" class="font-weight-medium">{{ group.tryings }}</span>
            <span v-else class="font-weight-medium">no</span>
            <span class="caption ml-1">trying links,</span>
          </div>
          <div>
            <span v-if="group.problems" class="font-weight-medium">{{ group.problems }}</span>
            <span v-else class="font-weight-medium">no</span>
            <span class="caption ml-1">problem links</span>
          </div>
        </div>
      </v-card>

    </div>

    <alarm-note
      :alarm="group.alarm"
      class="pl-2 pt-3"
      @clicked="openAlarmDialog"
      :key="alarmNoteRefresherKey"
    ></alarm-note>

    <alarm-dialog
      ref="alarmDialog"
      @setOff="setAlarmOff"
      @saved="saveAlarm"
    ></alarm-dialog>

    <edit
      ref="editDialog"
      @saved="save"
    />

    <add-link
      ref="addLinkDialog"
      :groupId="group.id"
      :groupName="group.name"
      @added="addLinks"
    />

    <confirm ref="confirm"></confirm>

  </v-card>
</template>

<script>
import GroupService from '@/service/group';
import AlarmService from '@/service/alarm';

export default {
  props: ['fromSearchPage', 'group'],
  computed: {
    findMinWidthForCells() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return '48%'
        default:
          return '24.25%'
      }
    }
  },
  data() {
    return {
      alarmNoteRefresherKey: 0,
    };
  },
  methods: {
    openAddLinkDialog() {
      this.$refs.addLinkDialog.open();
    },
    openEditDialog() {
      let cloned = JSON.parse(JSON.stringify(this.group));
      this.$refs.editDialog.open(cloned);
    },
    remove() {
      this.$refs.confirm.open('Delete', 'will be deleted. Are you sure?', this.group.name).then(async (confirm) => {
        if (confirm == true) {
          const result = await GroupService.remove(this.group.id);
          if (result && result.status) this.$emit('removed', this.group);
        }
      });
    },
    async save(form) {
      const result = await GroupService.save(form);
      if (result && result.status) {
        this.$emit('saved', result.data);
      }
    },
    async addLinks(links) {
      const result = await GroupService.insertLinks(this.group.id, this.fromSearchPage, links);
      if (result && result.status) this.$emit('linksAdded', result.data);
    },
    openDetails() {
      if (this.fromSearchPage) {
        this.$router.push({ name: 'group', params: {id: this.group.id} });
      }
    },
    openAlarmDialog() {
      let cloned = {};
      if (this.group.alarm) {
        cloned = JSON.parse(JSON.stringify(this.group.alarm));
      } else {
        cloned = {
          subject: 'STATUS',
          subjectWhen: 'CHANGED',
          priceLowerLimit: 0,
          priceUpperLimit: 0,
        };
      }
      cloned.topic = 'GROUP';
      cloned.name = this.group.name;
      this.$refs.alarmDialog.open(cloned);
    },
    async saveAlarm(form) {
      form.groupId = this.group.id;
      const result = await AlarmService.save(form);
      if (result && result.status) {
        this.group.alarm = result.data;
        this.group.alarmId = result.data.id;
        this.alarmNoteRefresherKey++;
      }
    },
    setAlarmOff(id) {
      this.$refs.confirm.open('Remove', 'will be removed. Are you sure?', 'This alarm').then((confirm) => {
        if (confirm == true) {
          const self = this;
          AlarmService.remove(id).then((res) => {
            if (res && res.status) {
              self.group.alarmId = null;
              self.group.alarm = null;
              self.alarmNoteRefresherKey++;
            }
          });
        }
      });
    },
  },
  components: {
    Edit: () => import('./Edit'),
    AddLink: () => import('./AddLink'),
    AlarmNote: () => import('@/component/simple/AlarmNote.vue'),
    AlarmDialog: () => import('@/component/special/AlarmDialog.vue'),
    Confirm: () => import('@/component/Confirm.vue')
  },
};
</script>

<template>

  <div>
    <div class="title">Alarms</div>

    <div class="body-2 my-3">
      In order to be notified for any changings, define alarms here and set them on to your products and competitor links.
    </div>

    <!-- --------------- -->
    <!-- Filter and Rows -->
    <!-- --------------- -->
    <div class="d-flex justify-space-between">
      <div class="col-6 pl-0">
        <v-text-field 
          :loading="loading"
          v-model="searchTerm"
          @keyup="isSearchable($event)"
          dense solo
          maxlength="100"
          hide-details
          placeholder="Search..."
          prepend-inner-icon="mdi-magnify"
        >
        </v-text-field>
      </div>

      <v-btn 
        small
        class="my-auto"
        @click="openAlarmDialog(null)"
        :disabled="$store.get('session/isNotEditor')"
      >
        Add
      </v-btn>
    </div>

    <v-card tile v-if="searchResult && searchResult.length">
      <table class="list-table">
        <thead>
          <tr>
            <th class="text-left">Whan a</th>
            <th width="4%"></th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="row in searchResult" :key="row.id"
            @click="$router.push( { name: 'alarm', params: { id: row.id } })"
            style="cursor: pointer"
          >
            <td>{{ row.name }}</td>
            <td class="my-auto">
              <v-menu offset-y bottom left>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    small icon
                    v-on="on"
                    v-bind="attrs"
                  >
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list dense>
                  <v-list-item link @click="openAlarmDialog(row)">
                    <v-list-item-title>EDIT</v-list-item-title>
                  </v-list-item>

                  <v-list-item link @click="remove(row)" :disabled="$store.get('session/isNotEditor')">
                    <v-list-item-title>DELETE</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </td>
          </tr>
        </tbody>
      </table>
    </v-card>

    <v-card v-else-if="!loading" >
      <block-message 
        :message="'No alarm found! You can add a new one or change your criteria.'" 
      />
    </v-card>

    <alarm-dialog ref="alarmDialog" @saved="saveAlarm"></alarm-dialog>
    <confirm ref="confirm"></confirm>
  </div>

</template>

<script>
import AlarmService from '@/service/alarm';

export default {
  data() {
    return {
      searchTerm: '',
      loading: false,
      searchResult: [],
    };
  },
  methods: {
    remove(row) {
      this.$refs.confirm.open('Delete', 'will be deleted. Are you sure?', row.name).then(async (confirm) => {
        if (confirm == true) {
          const result = await AlarmService.remove(row.id);
          if (result && result.status) this.search();
        }
      });
    },
    search() {
      this.loading = true;
      AlarmService.search(this.searchTerm)
        .then((res) => {
          if (res?.length) {
            this.searchResult = res;
          } else {
            this.searchResult = [];
          }
      }).finally(() => this.loading = false);
    },
    isSearchable(e) {
      let char = e.keyCode || e.charCode;
      if (char == 8 || char > 31) {
        return this.search();
      }
    },
    openAlarmDialog(row) {
      this.$refs.alarmDialog.open(row);
    },
    saveAlarm(form) {
      AlarmService.save(form).then(res => {
        if (res && res.status) {
          this.search();
          this.$refs.alarmDialog.close();
        }
      });
    },
  },
  watch: {
    searchForm() {
      this.search();
    },
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

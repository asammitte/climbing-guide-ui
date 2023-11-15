<!-- <template>
  <v-breadcrumbs :items="items" density="comfortable">
    <template v-slot:divider>
      <v-icon icon="mdi-chevron-right"></v-icon>
    </template>
  </v-breadcrumbs>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface IBreadcrumbItem {
  title: string;
  disabled: boolean;
  url: string;
}

const items = ref<IBreadcrumbItem[]>([
  {
    title: 'Dashboard',
    disabled: false,
    url: 'breadcrumbs_dashboard',
  },
  {
    title: 'Link 1',
    disabled: false,
    url: 'breadcrumbs_link_1',
  },
  {
    title: 'Link 2',
    disabled: true,
    url: 'breadcrumbs_link_2',
  },
])
</script> -->

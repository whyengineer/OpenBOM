<template>
  <div class="home">
    <Table />
  </div>
</template>

<script>
// @ is an alias to /src
import Table from "@/components/bomTable.vue";

export default {
  name: "bom",

  components: {
    Table,
  },
};
</script>

<template>
  <div class="home">
    <Table />
  </div>
</template>

<script>
// @ is an alias to /src
import Table from "@/components/table.vue";

export default {
  name: "Home",

  components: {
    Table,
  },
};
</script>

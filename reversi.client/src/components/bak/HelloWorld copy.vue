<template>
  <div>
    <p id="htmlMessage">{{ message }}</p>
    <v-btn @click="onClick" small>CountUp</v-btn>
    <p id="count">{{ count }}</p>
  </div>
</template>

<script>
  export default {
    data: () => ({
      message: 'HelloWorld',
      count: 0
    }),
    methods: {
      onClick () {
        this.count++;
      }
    }
  }
</script>

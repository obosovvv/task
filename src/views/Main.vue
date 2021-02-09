<template>
  <div class="container">
    <q-list bordered class="rounded-borders" >
      <q-expansion-item
        switch-toggle-side
        expand-separator
        v-for="(key, value) in names"
        :key="value"
        :label="key.G"
      >
        <q-list bordered separator>
          <q-item
            clickable
            v-for="(item, index) in getItems(+value)"
            :key="index"
          >
            <q-item-section>{{`${title(item.T, value)} (${item.P})`}}</q-item-section>
            <q-item-section>
              <q-btn flat :disable="!item.P" @click="addToCart({name: title(item.T, value), price: (item.C * rate).toFixed(2), index, G: item.G, T: item.T, P: item.P})">add</q-btn>
            </q-item-section>
            <q-item-section side>{{(item.C * rate).toFixed(2)}} ₽</q-item-section>
          </q-item>
        </q-list>
      </q-expansion-item>
    </q-list>
    <Cart />
  </div>
</template>

<script>
import Cart from './Cart'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'Main',
  components: { Cart },
  data() {
    return {
      rate: 74.01
    }
  },
  computed: {
    ...mapGetters([
      'names',
      'goods'
    ])
  },
  methods: {
    ...mapActions({
      fetchNames: 'FETCHNAMES',
      fetchGoods: 'FETCHGOODS',
      addToCart: 'ADDTOCART'
    }),
    getItems(id) {
      return this.goods.filter(item => item.G === id)
    },
    title(id, category) {
      return this.names[category].B[id].N
    }
  },
  mounted() {
    this.fetchNames()
    this.fetchGoods()
  }
}
</script>

<style lang="scss" scoped>
  .container {
    padding: 50px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }
  .rounded-borders {
    width: 1000px;
  }
</style>
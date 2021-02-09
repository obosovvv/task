<template>
    <div class="container">
        <q-list bordered class="rounded-borders">
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
                        :class="rate > previousValue ? 'green' : rate < previousValue ? 'red' : ''"
                    >
                        <q-item-section
                        >{{`${title(item.T, value)} (${item.P})`}}
                        </q-item-section>
                        <q-item-section>
                            <q-btn color="primary">add</q-btn>
                        </q-item-section>
                        <q-item-section class="fixed-price" side>{{(item.C * rate).toFixed(2)}} ₽
                        </q-item-section>
                        <q-item-section class="fixed-price" side>+{{parseInt(getPercent)}} %
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-expansion-item>
        </q-list>
        <Cart/>
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
        previousValue: ''
      }
    },
    computed: {
      ...mapGetters([
        'names',
        'goods',
        'rate'
      ]),
      getPercent () {
        if (this.rate > this.previousValue) {
          return ((this.rate - this.previousValue) / this.rate) * 100
        }
        return 0
      }
    },
    methods: {
      ...mapActions({
        fetchNames: 'FETCHNAMES',
        fetchGoods: 'FETCHGOODS'
      }),
      getItems(id) {
        return this.goods.filter(item => item.G === id)
      },
      title(id, category) {
        return this.names[category].B[id].N
      },
      savePrevious() {
        this.previousValue = this.rate
      }
    },
    mounted() {
      this.fetchNames()
      this.fetchGoods()
      setInterval(() => {
        this.savePrevious();
        this.fetchGoods()
      }, 15000)
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
    .green {
        background-color: rgba(14, 203, 129, 0.19);
        transition: all 1s ease;
    }
    .red {
        background-color: rgba(246, 70, 93, 0.22);
        transition: all 1s ease;
    }
    .fixed-price {
        width: 150px;
    }

    .rounded-borders {
        width: 1000px;
    }
</style>

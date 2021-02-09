<template>
    <div class="container">
        <Cart class="cart"/>
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
                        <q-item-section>{{`${title(item.T, value)} (${item.P - getQuantity({G: item.G, T: item.T})})`}}
                        </q-item-section>
                        <q-item-section>
                            <q-btn flat :disable="!item.P" color="primary"
                                   @click="addToCart({name: title(item.T, value), price: item.C, index, G: item.G, T: item.T, P: item.P})">
                                add
                            </q-btn>
                        </q-item-section>
                        <q-item-section class="fixed-price" side>{{(item.C * rate).toFixed(2)}} ₽</q-item-section>
                        <q-item-section class="fixed-price" side>+{{parseInt(getPercent)}} %
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-expansion-item>
        </q-list>
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
        'itemQuantity',
        'cart',
        'names',
        'goods',
        'rate'
      ]),
      getPercent() {
        if (this.rate > this.previousValue) {
          return ((this.rate - this.previousValue) / this.rate) * 100
        }
        return 0
      },
    },
    methods: {
      ...mapActions({
        fetchNames: 'FETCHNAMES',
        fetchGoods: 'FETCHGOODS',
        addToCart: 'ADDTOCART',
      }),
      getQuantity(payload) {
        const foundItem = this.itemQuantity.find(item => {
          if (item.G === payload.G && item.T === payload.T) {
            return true
          }
        })
        return foundItem ? foundItem.quantity : 0
      },
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
      }, 30000)
    }
  }
</script>

<style lang="scss" scoped>
    .cart {
        background-color: #fff;
    }

    .container {
        padding: 50px;
        display: flex;
        flex-direction: column;
        align-items: center;
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

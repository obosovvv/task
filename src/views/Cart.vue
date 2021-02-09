<template>
  <div>
    <q-btn color="primary" style="position: fixed; z-index: 999; right: 360px" label="Cart" @click="showModal = !showModal" />
    <q-dialog v-model="showModal">
      <q-card style="width: 1000px; max-width: 80vw;">
        <table class="cart-table">
          <thead>
          <tr>
            <td class="name">Наименование товара и описание</td>
            <td class="quantity">Количество</td>
            <td class="price">Цена</td>
            <td></td>
          </tr>
          </thead>
          <tbody>
          <tr v-if="!cart[0]" style="padding: 10px">Нет покупок</tr>
          <tr v-else v-for="(item, index) in cart" :key="index">
            <td class="name">{{item.name}}</td>
            <td>
              <input
                  type="number"
                  :value="getQuantity({G: item.G, T: item.T})"
                  @input="e => input(e, {max: item.P, G: item.G, T: item.T})"
              />
            </td>
            <td>{{(parseInt(item.price * rate))}} ₽ / шт.</td>
            <td @click="deleteProduct({index, max: item.P, G: item.G, T: item.T})"><q-btn color="primary">Удалить</q-btn></td>
          </tr>
          </tbody>
        </table>
        <div class="total">Общая стоимость: {{total}} ₽</div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: "Cart",
  data: () => ({
    quantity: 0,
    showModal: false
  }),
  computed: {
    ...mapGetters([ 'cart', 'rate', 'itemQuantity' ]),
    total() {
      let total = 0
      this.cart.forEach(item => {
        total = total + item.price * this.getQuantity({G: item.G, T: item.T}) * this.rate
      })
      return total.toFixed(2)
    }
  },
  methods: {
    ...mapActions({
      deleteProduct: 'DELETE',
      changeQuantity: 'CHANGEQUANTITY'
    }),
    getQuantity(payload) {
      const foundItem = this.itemQuantity.find(item => {
        if (item.G === payload.G && item.T === payload.T) {
          return true
        }
      })
      return foundItem ? foundItem.quantity : 0
    },
    input(e, { max, G, T }) {
      if (e.target.value <= 0) e.target.value = 1
      if (e.target.value >= max) e.target.value = max
      this.changeQuantity({ quantity: e.target.value, G, T })
    }
  }
}
</script>

<style lang="scss">
  .cart-table {
    margin: 0 auto;
    padding: 20px 20px 0 20px;
    width: 960px;
    & .name {
      width: 60%;
      text-align: left;
    }
    & .price {
      width: 20%;
    }
    & .quantity {
      width: 10%;
    }
    & td {
      border-bottom: 1px solid silver;
      padding: 10px 0;
      text-align: center;
    }
    & input {
      width: 100px;
    }
    & .btn-delete {
      cursor: pointer;
    }
  }
  .total {
    padding: 20px;
    text-align: right;
    margin-top: 10px;
  }
</style>

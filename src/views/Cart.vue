<template>
  <div>
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
        <tr v-for="(item, index) in cart" :key="index">
          <td class="name">{{item.name}}</td>
          <td>
            <input
              type="number"
              :value="item.quantity"
              @input="e => input(e, {index, max: item.P, G: item.G, T: item.T})"
            />
          </td>
          <td>{{item.price}} ₽ / шт.</td>
          <td class="btn-delete" @click="deleteProduct({index, max: item.P, G: item.G, T: item.T})">Удалить</td>
        </tr>
      </tbody>
    </table>
    <div class="total">Общая стоимость: {{total}} ₽</div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: "Cart",
  data: () => ({
    quantity: 0
  }),
  computed: {
    ...mapGetters([ 'cart' ]),
    total() {
      let total = 0
      this.cart.forEach(item => {
        total = total + item.price * item.quantity
      })
      return total.toFixed(2)
    }
  },
  methods: {
    ...mapActions({
      deleteProduct: 'DELETE',
      changeQuantity: 'CHANGEQUANTITY'
    }),
    input(e, { index, max, G, T }) {
      if (e.target.value <= 0) e.target.value = 1
      if (e.target.value >= max) e.target.value = max
      this.changeQuantity({ quantity: e.target.value, index, G, T })
    }
  }
}
</script>

<style lang="scss">
  .cart-table {
    width: 750px;
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
    text-align: right;
    margin-top: 10px;
  }
</style>
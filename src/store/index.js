import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    itemQuantity: [],
    names: {},
    goods: [],
    cart: [],
    rate: 74.01
  },
  getters: {
    itemQuantity: state => state.itemQuantity,
    rate: state => state.rate,
    names: state => state.names,
    goods: state => state.goods,
    cart: state => state.cart
  },
  actions: {
    async 'FETCHNAMES'({commit}) {
      const names = (await axios.get(`http://localhost:3000/names`)).data
      commit('NAMES', names)
    },
    async 'FETCHGOODS'({commit}) {
      const goods = (await axios.get(`http://localhost:3000/data`)).data.Value.Goods
      const newRate = Math.floor(Math.random() * (80 - 20 + 1)) + 20;
      commit('CHANGERATE', newRate)
      commit('GOODS', goods)
    },
    'ADDTOCART'({commit}, item) {
      commit('ADDTOCART', item)
    },
    'DELETE'({commit}, index) {
      commit('DELETE', index)
    },
    'CHANGEQUANTITY'({commit}, payload) {
      commit('CHANGEQUANTITY', payload)
    }
  },
  mutations: {
    'CHANGERATE'(state, rate) {
      state.rate = rate
    },
    'NAMES'(state, names) {
      state.names = names
    },
    'GOODS'(state, goods) {
      state.goods = goods
    },
    'ADDTOCART'(state, product) {
      if (state.cart.length && state.cart.find(item => item.index === product.index && item.name === product.name)) {
        state.cart = state.cart.map(item => {
          if (item.index === product.index && item.name === product.name) {
            return item
          } else return item
        })
      } else {
        product.quantity = 1
        state.cart.push(product)
      }
      // state.goods.forEach(item => {
      //   if (item.G === product.G && item.T === product.T) {
      //   }
      // })
      const foundItemQuantity = state.itemQuantity.find(item => {
        if (item.G === product.G && item.T === product.T) {
          return true
        }
      })
      if (!foundItemQuantity) {
        state.itemQuantity.push({
          ...product,
          quantity: 1
        })
      } else {
        foundItemQuantity.quantity++
      }
    },
    'DELETE'(state, payload) {
      state.cart.splice(payload.index, 1)
      const foundItemQuantity = state.itemQuantity.find(item => {
        if (item.G === payload.G && item.T === payload.T) {
          return true
        }
      })
      foundItemQuantity.quantity = 0
    },
    'CHANGEQUANTITY'(state, payload) {
      const foundItemQuantity = state.itemQuantity.find(item => {
        if (item.G === payload.G && item.T === payload.T) {
          return true
        }
      })
      foundItemQuantity.quantity = payload.quantity
    }
  },
})

import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    names: {},
    goods: [],
    cart: []
  },
  getters: {
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
    'NAMES'(state, names) {
      state.names = names
    },
    'GOODS'(state, goods) {
      state.goods = goods
    },
    'ADDTOCART'(state, product) {
      if (state.cart.length && state.cart.find(item => item.index === product.index)) {
        state.cart = state.cart.map(item => {
          if (item.index === product.index) {
            item.quantity++
            return item
          } else return item
        })
      } else {
        product.quantity = 1
        state.cart.push(product)
      }
      state.goods.forEach(item => {
        if (item.G === product.G && item.T === product.T) {
          item.P = item.P - 1
        }
      })
    },
    'DELETE'(state, payload) {
      state.cart.splice(payload.index, 1)
      state.goods.forEach(item => {
        if (item.G === payload.G && item.T === payload.T) {
          item.P = payload.max
        }
      })
    },
    'CHANGEQUANTITY'(state, payload) {
      let quantity = payload.quantity - state.cart[payload.index].quantity
      state.cart[payload.index].quantity = payload.quantity
      state.goods.forEach(item => {
        if (item.G === payload.G && item.T === payload.T) {
          item.P = item.P - quantity
        }
      })
    }
  },
})
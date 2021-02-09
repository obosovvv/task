import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    names: {},
    goods: [],
    cart: [],
    rate: 74.01
  },
  getters: {
    rate: state => state.rate,
    names: state => state.names,
    goods: state => state.goods
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
    'ADDTOCART'(state, item) {
      state.push(item)
      console.log(state)
    }
  },
})

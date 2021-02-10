import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import {
  ADD_TO_CART,
  CART,
  CHANGE_QUANTITY,
  CHANGE_RATE,
  DELETE,
  FETCH_GOODS,
  FETCH_NAMES,
  GET_ITEM_BY_GROUP,
  GOODS,
  GROUP,
  GROUP_ID,
  NAME,
  ITEM_ID,
  ITEM_MAX_QUANTITY,
  ITEM_QUANTITY,
  NAMES,
  PRICE,
  NEW_ADD_TO_CART,
  RATE,
  NEW_DELETE
} from '../consts';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    newCart: [],
    itemQuantity: [],
    names: {},
    goods: [],
    cart: [],
    rate: 74.01
  },
  getters: {
    [GET_ITEM_BY_GROUP]: state => {
      const array = state.goods.map(item => {
        if (state.names[item[GROUP_ID]][GROUP][item[ITEM_ID]]) {
          return state.names[item[GROUP_ID]][NAME] = {
            group_name: state.names[item[GROUP_ID]][GROUP_ID],
            item: state.names[item[GROUP_ID]][GROUP][item[ITEM_ID]][NAME],
            item_id: item[ITEM_ID],
            group_id: item[GROUP_ID],
            price: item[PRICE],
            max_quantity: item[ITEM_MAX_QUANTITY]
          }
        }
      })
      console.log(array)
    },
    [ITEM_QUANTITY]: state => state.itemQuantity,
    [RATE]: state => state.rate,
    [NAMES]: state => state.names,
    [GOODS]: state => state.goods,
    [CART]: state => state.cart
  },
  actions: {
    async [FETCH_NAMES]({ commit }) {
      const names = (await axios.get(`http://localhost:3000/names`)).data
      commit(NAMES , names)
    },
    async [FETCH_GOODS]({ commit }) {
      const goods = (await axios.get(`http://localhost:3000/data`)).data.Value.Goods
      const newRate = Math.floor(Math.random() * (80 - 20 + 1)) + 20;
      commit(CHANGE_RATE, newRate)
      commit(GOODS, goods)
    },
    [ADD_TO_CART]({ commit }, item) {
      commit(ADD_TO_CART, item)
    },
    [DELETE] ({ commit }, index) {
      commit(DELETE, index)
    },
    [NEW_ADD_TO_CART] ({commit}, product) {
      commit(CHANGE_QUANTITY, product)
    },
    [CHANGE_QUANTITY] ({ commit }, payload) {
      commit(CHANGE_QUANTITY, payload)
    }
  },
  mutations: {
    [CHANGE_RATE] (state, rate) {
      state.rate = rate
    },
    [NAMES] (state, names) {
      state.names = names
    },
    [GOODS] (state, goods) {
      state.goods = goods
    },
    [NEW_ADD_TO_CART] (state, product) {
      const foundCart = state.newCart.find(item => item.item_id === product.item_id)
      if (foundCart) {
        foundCart.quantity++
      } else {
        state.newCart.push({...product, quantity: 1})
      }
    },
    [ADD_TO_CART] (state, product) {
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
    [NEW_DELETE] (state, product) {
      const productIndex = state.newCart.findIndex(item => item.item_id === product.item_id)
      if (productIndex) {
        state.newCart.splice(productIndex, 1)
      }
    },
    [DELETE](state, payload) {
      state.cart.splice(payload.index, 1)
      const foundItemQuantity = state.itemQuantity.find(item => {
        if (item.G === payload.G && item.T === payload.T) {
          return true
        }
      })
      foundItemQuantity.quantity = 0
    },
    [CHANGE_QUANTITY] (state, payload) {
      const foundItemQuantity = state.itemQuantity.find(item => {
        if (item.G === payload.G && item.T === payload.T) {
          return true
        }
      })
      foundItemQuantity.quantity = payload.quantity
    }
  },
})

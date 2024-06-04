import { createSlice } from '@reduxjs/toolkit';

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    activeOrders: [],
  },
  reducers: {
    addOrder: (state, action) => {
      state.activeOrders.push(action.payload);
    },
    updateOrder: (state, action) => {
      const index = state.activeOrders.findIndex(order => order.id === action.payload.id);
      if (index !== -1) {
        state.activeOrders[index] = action.payload;
      }
    },
  },
});

export const { addOrder, updateOrder } = ordersSlice.actions;
export default ordersSlice.reducer;

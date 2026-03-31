import React, { createContext, useContext, useReducer, useState } from 'react';
import { INITIAL_ASSORTMENTS, PRODUCTS, DOORS } from './data';

const AppContext = createContext(null);

function buildInitialQty(assortments) {
  const qty = {};
  assortments.forEach(a => {
    qty[a.id] = {};
    a.products.forEach(pid => {
      qty[a.id][pid] = {};
      a.doors.forEach(did => {
        qty[a.id][pid][did] = Math.floor(Math.random() * 18) * 6; // realistic multiples of 6
      });
    });
  });
  return qty;
}

const initialState = {
  assortments: INITIAL_ASSORTMENTS,
  activeAssortmentId: null,
  quantities: buildInitialQty(INITIAL_ASSORTMENTS),
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_ACTIVE_ASSORTMENT':
      return { ...state, activeAssortmentId: action.id };

    case 'CREATE_ASSORTMENT': {
      const newA = { ...action.assortment };
      const qty = {};
      newA.products.forEach(pid => {
        qty[pid] = {};
        newA.doors.forEach(did => { qty[pid][did] = 0; });
      });
      return {
        ...state,
        assortments: [...state.assortments, newA],
        quantities: { ...state.quantities, [newA.id]: qty },
        activeAssortmentId: newA.id,
      };
    }

    case 'ADD_PRODUCT_TO_ASSORTMENT': {
      const { assortmentId, productId } = action;
      const assortment = state.assortments.find(a => a.id === assortmentId);
      if (!assortment || assortment.products.includes(productId)) return state;
      const newAssortments = state.assortments.map(a =>
        a.id === assortmentId ? { ...a, products: [...a.products, productId], updatedAt: new Date().toISOString().split('T')[0] } : a
      );
      const qty = { ...state.quantities[assortmentId] };
      qty[productId] = {};
      assortment.doors.forEach(did => { qty[productId][did] = 0; });
      return {
        ...state,
        assortments: newAssortments,
        quantities: { ...state.quantities, [assortmentId]: qty },
      };
    }

    case 'REMOVE_PRODUCT_FROM_ASSORTMENT': {
      const { assortmentId, productId } = action;
      const newAssortments = state.assortments.map(a =>
        a.id === assortmentId ? { ...a, products: a.products.filter(p => p !== productId) } : a
      );
      const qty = { ...state.quantities[assortmentId] };
      delete qty[productId];
      return { ...state, assortments: newAssortments, quantities: { ...state.quantities, [assortmentId]: qty } };
    }

    case 'SET_QTY': {
      const { assortmentId, productId, doorId, value } = action;
      return {
        ...state,
        quantities: {
          ...state.quantities,
          [assortmentId]: {
            ...state.quantities[assortmentId],
            [productId]: {
              ...state.quantities[assortmentId]?.[productId],
              [doorId]: value,
            },
          },
        },
      };
    }

    case 'TOGGLE_DOOR_IN_ASSORTMENT': {
      const { assortmentId, doorId } = action;
      const assortment = state.assortments.find(a => a.id === assortmentId);
      if (!assortment) return state;
      const hasDoor = assortment.doors.includes(doorId);
      let newDoors;
      if (hasDoor) {
        newDoors = assortment.doors.filter(d => d !== doorId);
      } else {
        newDoors = [...assortment.doors, doorId];
      }
      const newAssortments = state.assortments.map(a =>
        a.id === assortmentId ? { ...a, doors: newDoors } : a
      );
      // Add qty entries for new door
      let qty = { ...state.quantities[assortmentId] };
      if (!hasDoor) {
        qty = Object.fromEntries(
          Object.entries(qty).map(([pid, doorQtys]) => [pid, { ...doorQtys, [doorId]: 0 }])
        );
      }
      return { ...state, assortments: newAssortments, quantities: { ...state.quantities, [assortmentId]: qty } };
    }

    case 'SET_BUYING_STAGE': {
      const { assortmentId, stage } = action;
      return {
        ...state,
        assortments: state.assortments.map(a =>
          a.id === assortmentId ? { ...a, stage } : a
        ),
      };
    }

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(toast => toast.id !== id)), 3000);
  };

  const activeAssortment = state.assortments.find(a => a.id === state.activeAssortmentId) ?? null;

  return (
    <AppContext.Provider value={{ state, dispatch, activeAssortment, toasts, addToast }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}

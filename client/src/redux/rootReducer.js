const initialState = {
    loading: false,
    cartItems: []
}

export const rootReducer = (state= initialState, action) => {
    switch(action.type){
        case "SHOW_LOADING" : 
        return {
            ...state,
            loading: true
        };
        case "HIDE_LOADING" : 
        return {
            ...state,
            loading: false
        };
        case "ADD_TO_CART":
        return {
            ...state,
            cartItems: [...state.cartItems, action.payload]
        };
        case "UPDATE_CART":
            return {
                ...state,
                cartItems: state.cartItems.map(item => item._id === action.payload._id ? {...item, singleQuantity:action.payload.singleQuantity} : item)
        };
        case "UPDATE_CART_ITEMS":
            return {
              
                cartItems: action.payload
               
        };
        case "UPDATE_CARTOONS":
            return {
                ...state,
                cartItems: state.cartItems.map(item => item._id === action.payload._id ? {...item, cartoonsQuantity:action.payload.cartoonsQuantity} : item)
        };
        case "DELETE_FROM_CART":
            return {
                ...state,
                cartItems: state.cartItems.filter(item => item._id !== action.payload._id)
            }
        
        default: return state
    }
}
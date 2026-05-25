import {configureStore} from '@reduxjs/toolkit'
import userSlice from "./userSlice"
import reviewsReducer from "./reviewSlice";

export default configureStore({
    reducer:{
        user:userSlice,
        reviews: reviewsReducer,

    },


})
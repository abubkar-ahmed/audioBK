import { createContext, useState } from "react";

const ProductsContext = createContext({});

export const ProductsProvider = ({ children }) => {
    const [allProducts , setAllProducts] = useState([]);

    return (
        <ProductsContext.Provider value={{ allProducts , setAllProducts }}>
            {children}
        </ProductsContext.Provider>
    )
}

export default ProductsContext;